import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import type { Registry } from "../../schemas/registry.js";
import { getPhasesForTrack, loadConfig } from "../lib/config.js";
import {
  loadRegistry,
  saveRegistry,
  phaseKey,
  getActiveFeature,
  patchFeatureItem,
} from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { appendAudit } from "../lib/audit.js";
import { printGitHint } from "../lib/git.js";
import { phaseFile, formatPhaseLabel } from "../lib/discovery-phases.js";
import { loadTaskProgress } from "../lib/tasks.js";
import {
  type FeatureArtifact,
  artifactPath,
  featureBriefPath,
  parseArtifactArg,
  getFeatureDir,
} from "../lib/features.js";

const ARTIFACT_STATUS_KEYS: Record<FeatureArtifact, string> = {
  feature: "feature_status",
  spec: "spec_status",
  design: "design_status",
  tasks: "tasks_status",
};

const ARTIFACT_APPROVED_AT: Record<FeatureArtifact, string> = {
  feature: "feature_approved_at",
  spec: "spec_approved_at",
  design: "design_approved_at",
  tasks: "tasks_approved_at",
};

const APPROVE_ORDER: FeatureArtifact[] = ["feature", "spec", "design", "tasks"];

function resolveFeatureName(name?: string, optionName?: string): string | null {
  if (optionName) return optionName;
  if (name && !["discovery", "change", "feature"].includes(name)) {
    const reg = loadRegistry();
    if (reg.features?.items?.[name]) return name;
  }
  return getActiveFeature(loadRegistry());
}

function assertArtifactReady(featureId: string, artifact: FeatureArtifact): void {
  let p = artifactPath(featureId, artifact);
  if (artifact === "feature") {
    const brief = featureBriefPath(featureId);
    if (!brief) {
      console.error(chalk.red(`Missing FEATURE.md for feature ${featureId}`));
      process.exit(1);
    }
    p = brief;
  } else if (!fs.existsSync(p)) {
    console.error(chalk.red(`Missing: ${p}`));
    process.exit(1);
  }
  const content = fs.readFileSync(p, "utf8");
  if (content.includes("<!-- Complete specialist output here -->")) {
    console.error(chalk.red(`${path.basename(p)} appears incomplete.`));
    process.exit(1);
  }
}

function getArtifactStatus(
  item: Record<string, unknown>,
  artifact: FeatureArtifact
): string | undefined {
  const key = ARTIFACT_STATUS_KEYS[artifact];
  if (artifact === "feature") {
    return (
      (item[key] as string | undefined) ??
      (item.proposal_status as string | undefined)
    );
  }
  return item[key] as string | undefined;
}

function nextArtifactToApprove(
  featureId: string,
  item: Record<string, unknown>
): FeatureArtifact | null {
  for (const a of APPROVE_ORDER) {
    if (a === "feature") {
      if (!featureBriefPath(featureId)) continue;
    } else if (!fs.existsSync(artifactPath(featureId, a))) continue;
    if (getArtifactStatus(item, a) !== "approved") return a;
    const atKey = ARTIFACT_APPROVED_AT[a];
    const legacyAt =
      a === "feature" ? item.proposal_approved_at : undefined;
    if (!item[atKey] && !legacyAt) return a;
  }
  return null;
}

export function runApprove(
  target?: string,
  options?: { change?: string; feature?: string }
): void {
  const registry = loadRegistry();
  const config = loadConfig();
  const featureOpt = options?.feature ?? options?.change;

  if (target === "discovery") {
    approveDiscoveryPhase(registry, config);
    return;
  }

  if (target === undefined) {
    const featureId = resolveFeatureName(undefined, featureOpt);
    if (featureId) {
      const item = registry.features?.items?.[featureId] as
        | Record<string, unknown>
        | undefined;
      const next = nextArtifactToApprove(featureId, item ?? {});
      if (next) {
        approveFeatureArtifact(featureId, next);
        return;
      }
      console.log(
        chalk.yellow(
          `Feature ${featureId}: all artifacts approved. Run specx build or specx approve change.`
        )
      );
      return;
    }
    approveDiscoveryPhase(registry, config);
    return;
  }

  try {
    const artifact = parseArtifactArg(target);
    const featureId = resolveFeatureName(undefined, featureOpt);
    if (!featureId) {
      console.error(chalk.red("No active feature."));
      process.exit(1);
    }
    approveFeatureArtifact(featureId, artifact);
    return;
  } catch {
    /* not an artifact name */
  }

  if (target === "change" || target === "feature") {
    const featureId = resolveFeatureName(undefined, featureOpt);
    if (!featureId) {
      console.error(chalk.red("No active feature."));
      process.exit(1);
    }
    approveWholeFeature(featureId);
    return;
  }

  const phaseNum = parseInt(target, 10);
  if (!Number.isNaN(phaseNum) && phaseNum >= 1 && phaseNum <= 11) {
    approveDiscoveryPhase(registry, config, phaseNum);
    return;
  }

  if (registry.features?.items?.[target]) {
    approveWholeFeature(target);
    return;
  }

  console.error(
    chalk.red(
      `Unknown target "${target}". Use: discovery | feature | spec | design | tasks | <phase> | <feature-id>`
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
    console.error(chalk.red("No active discovery phase."));
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
    console.error(chalk.red("Phase output appears empty."));
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
      chalk.green(`${formatPhaseLabel(phase)} approved. Next: ${formatPhaseLabel(next)}`)
    );
  } else {
    console.log(chalk.green(`${formatPhaseLabel(phase)} approved.`));
  }

  printGitHint([path.join("specx", "discovery", file), ".specx/registry.yaml"]);
}

function approveFeatureArtifact(
  featureId: string,
  artifact: FeatureArtifact
): void {
  assertArtifactReady(featureId, artifact);
  let registry = loadRegistry();
  const now = new Date().toISOString().slice(0, 10);
  const patch: Record<string, unknown> = {
    [ARTIFACT_STATUS_KEYS[artifact]]: "approved",
    [ARTIFACT_APPROVED_AT[artifact]]: now,
    phase: artifact,
  };
  if (artifact === "feature") {
    patch.proposal_status = "approved";
    patch.proposal_approved_at = now;
  }
  if (artifact === "tasks") {
    const progress = loadTaskProgress(featureId);
    if (progress) {
      patch.tasks_total = progress.total;
      patch.tasks_completed = progress.completed;
    }
  }
  const lifecycle: Record<FeatureArtifact, string> = {
    feature: "proposed",
    spec: "spec",
    design: "design",
    tasks: "tasks",
  };
  patch.status = lifecycle[artifact];

  registry = patchFeatureItem(registry, featureId, patch);
  saveRegistry(registry);
  appendAudit("feature.approve", { feature: featureId, artifact });

  const rel =
    artifact === "feature"
      ? featureBriefPath(featureId)!
      : artifactPath(featureId, artifact);
  console.log(chalk.green(`Approved ${artifact} for feature ${featureId}`));
  printGitHint([rel.replace(process.cwd() + path.sep, ""), ".specx/registry.yaml"]);

  const item = registry.features?.items?.[featureId] as Record<string, unknown>;
  const next = nextArtifactToApprove(featureId, item ?? {});
  if (next) {
    console.log(chalk.dim(`Next: specx approve ${next}`));
  }
}

function approveWholeFeature(featureId: string): void {
  const now = new Date().toISOString().slice(0, 10);
  const patch: Record<string, unknown> = {
    status: "approved",
    phase: "build",
  };
  for (const a of APPROVE_ORDER) {
    if (a === "feature" && !featureBriefPath(featureId)) continue;
    if (a !== "feature" && !fs.existsSync(artifactPath(featureId, a))) continue;
    assertArtifactReady(featureId, a);
    patch[ARTIFACT_STATUS_KEYS[a]] = "approved";
    patch[ARTIFACT_APPROVED_AT[a]] = now;
  }
  const progress = loadTaskProgress(featureId);
  if (progress) {
    patch.tasks_total = progress.total;
    patch.tasks_completed = progress.completed;
  }
  saveRegistry(patchFeatureItem(loadRegistry(), featureId, patch));
  console.log(chalk.green(`Feature ${featureId} approved for build.`));
  printGitHint([`specx/${featureId}`, ".specx/registry.yaml"]);
}

export function runRevise(
  target?: string,
  options?: { change?: string; feature?: string; message?: string }
): void {
  const registry = loadRegistry();
  const reason = options?.message ?? "Human requested revision";
  const featureOpt = options?.feature ?? options?.change;

  if (target === "discovery") {
    reviseDiscoveryPhase(registry);
    return;
  }

  if (target === undefined) {
    const active = resolveFeatureName(undefined, featureOpt);
    const item = active
      ? (registry.features?.items?.[active] as Record<string, unknown> | undefined)
      : undefined;
    if (
      active &&
      item &&
      (item.status === "revision" ||
        getArtifactStatus(item, "spec") === "revision" ||
        getArtifactStatus(item, "design") === "revision")
    ) {
      reviseFeatureArtifact(
        active,
        getArtifactStatus(item, "spec") === "revision" ? "spec" : "design",
        reason
      );
      return;
    }
    reviseDiscoveryPhase(registry);
    return;
  }

  try {
    const artifact = parseArtifactArg(target);
    const featureId = resolveFeatureName(undefined, featureOpt);
    if (!featureId) {
      console.error(chalk.red("No active feature."));
      process.exit(1);
    }
    reviseFeatureArtifact(featureId, artifact, reason);
    return;
  } catch {
    /* continue */
  }

  if (target === "change" || target === "feature") {
    const featureId = resolveFeatureName(undefined, featureOpt);
    if (!featureId) {
      console.error(chalk.red("No active feature."));
      process.exit(1);
    }
    reviseFeatureArtifact(featureId, "spec", reason);
    return;
  }

  const phaseNum = parseInt(target, 10);
  if (!Number.isNaN(phaseNum)) {
    reviseDiscoveryPhase(registry, phaseNum);
    return;
  }

  if (registry.features?.items?.[target]) {
    reviseFeatureArtifact(target, "spec", reason);
    return;
  }

  console.error(chalk.red(`Unknown revise target: ${target}`));
  process.exit(1);
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
        [key]: { ...registry.discovery?.phases?.[key], status: "revision" },
      },
    },
  });
  console.log(chalk.yellow(`${formatPhaseLabel(phase)} marked for revision.`));
}

function reviseFeatureArtifact(
  featureId: string,
  artifact: FeatureArtifact,
  reason: string
): void {
  const { specxDir } = getRoots();
  const featureDir = getFeatureDir(specxDir, featureId);
  const revisionPath = path.join(featureDir, "revision.md");
  if (!fs.existsSync(revisionPath)) {
    fs.writeFileSync(
      revisionPath,
      `# Revision — ${featureId}\n\n## Reason\n\n${reason}\n\n## Artifact\n\n${artifact}\n`,
      "utf8"
    );
  }

  const patch: Record<string, unknown> = {
    status: "revision",
    phase: "revision",
    [ARTIFACT_STATUS_KEYS[artifact]]: "revision",
    revision_reason: reason,
    revision_artifact: `specx/${featureId}/revision.md`,
  };
  saveRegistry(patchFeatureItem(loadRegistry(), featureId, patch));
  console.log(
    chalk.yellow(`Feature ${featureId}: ${artifact} marked for revision.`)
  );
}
