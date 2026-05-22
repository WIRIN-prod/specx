import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import type { Registry } from "../../schemas/registry.js";
import { getPhasesForTrack, loadConfig } from "../lib/config.js";
import { loadRegistry, saveRegistry, phaseKey, getActiveChange } from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { appendAudit } from "../lib/audit.js";
import { printGitHint } from "../lib/git.js";
import { phaseFile, formatPhaseLabel } from "../lib/discovery-phases.js";
import { loadTaskProgress } from "../lib/tasks.js";

export type BuildArtifact = "proposal" | "spec" | "design" | "tasks";

const ARTIFACT_FILES: Record<BuildArtifact, string> = {
  proposal: "proposal.md",
  spec: "spec.md",
  design: "design.md",
  tasks: "tasks.md",
};

const ARTIFACT_STATUS_KEYS: Record<BuildArtifact, string> = {
  proposal: "proposal_status",
  spec: "spec_status",
  design: "design_status",
  tasks: "tasks_status",
};

const ARTIFACT_APPROVED_AT: Record<BuildArtifact, string> = {
  proposal: "proposal_approved_at",
  spec: "spec_approved_at",
  design: "design_approved_at",
  tasks: "tasks_approved_at",
};

function isArtifact(s: string): s is BuildArtifact {
  return s in ARTIFACT_FILES;
}

function resolveChangeName(name?: string): string | null {
  if (name) return name;
  return getActiveChange(loadRegistry());
}

function patchChangeItem(
  registry: Registry,
  changeName: string,
  patch: Record<string, unknown>
): Registry {
  const item = registry.changes?.items?.[changeName];
  if (!item) {
    console.error(chalk.red(`Unknown change: ${changeName}`));
    process.exit(1);
  }
  return {
    ...registry,
    changes: {
      ...registry.changes,
      items: {
        ...registry.changes?.items,
        [changeName]: { ...item, ...patch },
      },
    },
  };
}

function artifactPath(changeName: string, artifact: BuildArtifact): string {
  const { specxDir } = getRoots();
  return path.join(specxDir, "changes", changeName, ARTIFACT_FILES[artifact]);
}

function assertArtifactReady(
  changeName: string,
  artifact: BuildArtifact
): void {
  const p = artifactPath(changeName, artifact);
  if (!fs.existsSync(p)) {
    console.error(chalk.red(`Missing: ${p}`));
    process.exit(1);
  }
  const content = fs.readFileSync(p, "utf8");
  if (content.includes("<!-- Complete specialist output here -->")) {
    console.error(
      chalk.red(`${ARTIFACT_FILES[artifact]} appears incomplete. Finish before approve.`)
    );
    process.exit(1);
  }
}

function nextArtifactToApprove(
  changeName: string,
  item: Record<string, unknown>
): BuildArtifact | null {
  const order: BuildArtifact[] = ["proposal", "spec", "design", "tasks"];
  for (const a of order) {
    const p = artifactPath(changeName, a);
    if (!fs.existsSync(p)) continue;
    const statusKey = ARTIFACT_STATUS_KEYS[a];
    const st = item[statusKey];
    if (st !== "approved") return a;
    if (a === "proposal" && !item.proposal_approved_at) return a;
  }
  return null;
}

export function runApprove(
  target?: string,
  options?: { change?: string }
): void {
  const registry = loadRegistry();
  const config = loadConfig();

  if (target === "discovery") {
    approveDiscoveryPhase(registry, config);
    return;
  }

  if (target === undefined) {
    const change = resolveChangeName(options?.change);
    if (change) {
      const item = registry.changes?.items?.[change] as
        | Record<string, unknown>
        | undefined;
      const next = nextArtifactToApprove(change, item ?? {});
      if (next) {
        approveChangeArtifact(change, next);
        return;
      }
      console.log(
        chalk.yellow(
          `Change ${change}: all artifacts already approved. Use specx approve change or specx build.`
        )
      );
      return;
    }
    const active = getActiveChange(registry);
    if (active) {
      const item = registry.changes?.items?.[active] as
        | Record<string, unknown>
        | undefined;
      const next = nextArtifactToApprove(active, item ?? {});
      if (next) {
        approveChangeArtifact(active, next);
        return;
      }
    }
    approveDiscoveryPhase(registry, config);
    return;
  }

  if (isArtifact(target)) {
    const change = resolveChangeName(options?.change);
    if (!change) {
      console.error(chalk.red("No active change. Use: specx approve <artifact> --change <name>"));
      process.exit(1);
    }
    approveChangeArtifact(change, target);
    return;
  }

  if (target === "change") {
    const change = resolveChangeName(options?.change);
    if (!change) {
      console.error(chalk.red("No active change."));
      process.exit(1);
    }
    approveWholeChange(change);
    return;
  }

  const phaseNum = parseInt(target, 10);
  if (!Number.isNaN(phaseNum) && phaseNum >= 1 && phaseNum <= 11) {
    approveDiscoveryPhase(registry, config, phaseNum);
    return;
  }

  const items = registry.changes?.items ?? {};
  if (items[target]) {
    approveWholeChange(target);
    return;
  }

  console.error(
    chalk.red(
      `Unknown target "${target}". Use: discovery | proposal | spec | design | tasks | change | <phase 1-11> | <change-name>`
    )
  );
  process.exit(1);
}

function approveDiscoveryPhase(
  registry: Registry,
  config: ReturnType<typeof loadConfig>,
  phaseOverride?: number
): void {
  const phase = phaseOverride ?? registry.discovery?.current_phase;
  if (!phase) {
    console.error(chalk.red("No active discovery phase. Use: specx approve <1-11>"));
    process.exit(1);
  }

  const phases = getPhasesForTrack(config.track);
  if (!phases.includes(phase)) {
    console.error(chalk.red(`Phase ${phase} not in track ${config.track}`));
    process.exit(1);
  }

  const key = phaseKey(phase);
  const { specxDir } = getRoots();
  const file = phaseFile(phase);
  const outPath = path.join(specxDir, "discovery", file);

  if (!fs.existsSync(outPath)) {
    console.error(chalk.red(`Phase output missing: ${outPath}`));
    process.exit(1);
  }

  const content = fs.readFileSync(outPath, "utf8");
  if (content.includes("<!-- Complete specialist output here -->")) {
    console.error(chalk.red("Phase output appears empty. Complete before approve."));
    process.exit(1);
  }

  const updated = {
    ...registry,
    discovery: {
      ...registry.discovery,
      phases: {
        ...registry.discovery?.phases,
        [key]: {
          ...registry.discovery?.phases?.[key],
          status: "approved" as const,
          approved_at: new Date().toISOString(),
        },
      },
    },
  };
  saveRegistry(updated);
  appendAudit("discovery.approve", { phase, key });

  const idx = phases.indexOf(phase);
  if (phaseOverride === undefined && idx >= 0 && idx < phases.length - 1) {
    const next = phases[idx + 1];
    saveRegistry({
      ...updated,
      discovery: { ...updated.discovery, current_phase: next },
    });
    console.log(
      chalk.green(
        `${formatPhaseLabel(phase)} approved. Next: ${formatPhaseLabel(next)}`
      )
    );
  } else {
    console.log(chalk.green(`${formatPhaseLabel(phase)} approved.`));
    if (idx === phases.length - 1) {
      console.log(chalk.dim("Discovery complete for track."));
    }
  }

  printGitHint([
    path.join("specx", "discovery", file),
    ".specx/registry.yaml",
  ]);
}

function approveChangeArtifact(changeName: string, artifact: BuildArtifact): void {
  assertArtifactReady(changeName, artifact);
  let registry = loadRegistry();
  const now = new Date().toISOString().slice(0, 10);
  const statusKey = ARTIFACT_STATUS_KEYS[artifact];
  const atKey = ARTIFACT_APPROVED_AT[artifact];

  const patch: Record<string, unknown> = {
    [statusKey]: "approved",
    [atKey]: now,
    phase: artifact,
  };

  if (artifact === "tasks") {
    const progress = loadTaskProgress(changeName);
    if (progress) {
      patch.tasks_total = progress.total;
      patch.tasks_completed = progress.completed;
    }
  }

  const lifecycleAfter: Record<BuildArtifact, string> = {
    proposal: "proposed",
    spec: "spec",
    design: "design",
    tasks: "tasks",
  };
  patch.status = lifecycleAfter[artifact];

  registry = patchChangeItem(registry, changeName, patch);
  saveRegistry(registry);
  appendAudit("build.approve", { change: changeName, artifact });

  console.log(
    chalk.green(`Approved ${artifact} for change ${changeName}`)
  );
  printGitHint([
    path.join("specx", "changes", changeName, ARTIFACT_FILES[artifact]),
    ".specx/registry.yaml",
  ]);

  const item = registry.changes?.items?.[changeName] as Record<string, unknown>;
  const next = nextArtifactToApprove(changeName, item ?? {});
  if (next) {
    console.log(chalk.dim(`Next to approve: ${next} (specx approve ${next})`));
  } else {
    console.log(chalk.dim("All artifacts approved. Run specx build when ready."));
  }
}

function approveWholeChange(changeName: string): void {
  const now = new Date().toISOString().slice(0, 10);
  const patch: Record<string, unknown> = {
    status: "approved",
    phase: "build",
  };
  for (const a of ["proposal", "spec", "design", "tasks"] as BuildArtifact[]) {
    if (!fs.existsSync(artifactPath(changeName, a))) continue;
    assertArtifactReady(changeName, a);
    patch[ARTIFACT_STATUS_KEYS[a]] = "approved";
    patch[ARTIFACT_APPROVED_AT[a]] = now;
  }
  const progress = loadTaskProgress(changeName);
  if (progress) {
    patch.tasks_total = progress.total;
    patch.tasks_completed = progress.completed;
  }
  let registry = patchChangeItem(loadRegistry(), changeName, patch);
  saveRegistry(registry);
  appendAudit("build.approve", { change: changeName, artifact: "change" });
  console.log(chalk.green(`Change ${changeName} approved for build.`));
  printGitHint([
    path.join("specx", "changes", changeName),
    ".specx/registry.yaml",
  ]);
}

export function runRevise(
  target?: string,
  options?: { change?: string; message?: string }
): void {
  const registry = loadRegistry();
  const reason = options?.message ?? "Human requested revision";

  if (target === "discovery" || target === undefined) {
    if (target === undefined && !options?.change) {
      const active = getActiveChange(registry);
      const item = active
        ? (registry.changes?.items?.[active] as Record<string, unknown> | undefined)
        : undefined;
      const hasRevisionGate =
        item &&
        (item.spec_status === "revision" ||
          item.design_status === "revision" ||
          item.tasks_status === "revision" ||
          item.status === "revision");
      if (active && hasRevisionGate) {
        reviseChangeArtifact(active, inferRevisionArtifact(item), reason);
        return;
      }
    }
    reviseDiscoveryPhase(registry);
    return;
  }

  if (isArtifact(target)) {
    const change = resolveChangeName(options?.change);
    if (!change) {
      console.error(chalk.red("No active change."));
      process.exit(1);
    }
    reviseChangeArtifact(change, target, reason);
    return;
  }

  if (target === "change") {
    const change = resolveChangeName(options?.change);
    if (!change) {
      console.error(chalk.red("No active change."));
      process.exit(1);
    }
    reviseWholeChange(change, reason);
    return;
  }

  const phaseNum = parseInt(target, 10);
  if (!Number.isNaN(phaseNum) && phaseNum >= 1 && phaseNum <= 11) {
    reviseDiscoveryPhase(registry, phaseNum);
    return;
  }

  const items = registry.changes?.items ?? {};
  if (items[target]) {
    reviseWholeChange(target, reason);
    return;
  }

  console.error(
    chalk.red(
      `Unknown target "${target}". Use: discovery | proposal | spec | design | tasks | change | <phase> | <change-name>`
    )
  );
  process.exit(1);
}

function inferRevisionArtifact(
  item: Record<string, unknown>
): BuildArtifact {
  if (item.spec_status === "revision") return "spec";
  if (item.design_status === "revision") return "design";
  if (item.tasks_status === "revision") return "tasks";
  return "spec";
}

function reviseDiscoveryPhase(registry: Registry, phaseOverride?: number): void {
  const phase = phaseOverride ?? registry.discovery?.current_phase;
  if (!phase) {
    console.error(chalk.red("No active discovery phase."));
    process.exit(1);
  }
  const key = phaseKey(phase);
  saveRegistry({
    ...registry,
    discovery: {
      ...registry.discovery,
      phases: {
        ...registry.discovery?.phases,
        [key]: {
          ...registry.discovery?.phases?.[key],
          status: "revision",
        },
      },
    },
  });
  console.log(chalk.yellow(`${formatPhaseLabel(phase)} marked for revision.`));
  appendAudit("discovery.revise", { phase, key });
}

function reviseChangeArtifact(
  changeName: string,
  artifact: BuildArtifact,
  reason: string
): void {
  const { specxDir } = getRoots();
  const changeDir = path.join(specxDir, "changes", changeName);
  const revisionPath = path.join(changeDir, "revision.md");
  if (!fs.existsSync(revisionPath)) {
    fs.writeFileSync(
      revisionPath,
      `# Revision — ${changeName}\n\n## Reason\n\n${reason}\n\n## Artifact\n\n${artifact}\n`,
      "utf8"
    );
  }

  const statusKey = ARTIFACT_STATUS_KEYS[artifact];
  let registry = patchChangeItem(loadRegistry(), changeName, {
    status: "revision",
    phase: "revision",
    [statusKey]: "revision",
    revision_reason: reason,
    revision_artifact: `specx/changes/${changeName}/revision.md`,
  });
  saveRegistry(registry);
  appendAudit("build.revise", { change: changeName, artifact, reason });
  console.log(
    chalk.yellow(`Change ${changeName}: ${artifact} marked for revision.`)
  );
  console.log(chalk.dim(`  ${revisionPath}`));
}

function reviseWholeChange(changeName: string, reason: string): void {
  for (const a of ["spec", "design", "tasks"] as BuildArtifact[]) {
    if (fs.existsSync(artifactPath(changeName, a))) {
      reviseChangeArtifact(changeName, a, reason);
      return;
    }
  }
  reviseChangeArtifact(changeName, "spec", reason);
}
