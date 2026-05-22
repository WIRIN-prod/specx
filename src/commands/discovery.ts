import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { getPhasesForTrack, loadConfig } from "../lib/config.js";
import { loadRegistry, saveRegistry, phaseKey } from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { appendAudit } from "../lib/audit.js";
import { printGitHint } from "../lib/git.js";
import { writeFromTemplate, defaultVars } from "../lib/template.js";
import {
  DISCOVERY_PHASES,
  formatPhaseLabel,
} from "../lib/discovery-phases.js";

function phaseFile(n: number): string {
  return DISCOVERY_PHASES[n]?.file ?? `${String(n).padStart(2, "0")}.md`;
}

export function runDiscover(): void {
  const config = loadConfig();
  const registry = loadRegistry();
  const phases = getPhasesForTrack(config.track);
  const current = registry.discovery?.current_phase;

  console.log(chalk.bold("\nDiscovery status"));
  console.log(`Track: ${config.track}`);
  console.log(`Phases: ${phases.join(", ")}`);
  console.log(`Current phase: ${current ?? "none"}`);

  if (registry.discovery?.phases) {
    for (const n of phases) {
      const key = phaseKey(n);
      const st = registry.discovery.phases?.[key]?.status ?? "pending";
      console.log(`  ${formatPhaseLabel(n)}: ${st}`);
      const meta = DISCOVERY_PHASES[n];
      if (meta) console.log(chalk.dim(`      ${meta.file}`));
    }
  }
}

export function runDiscoverQuick(): void {
  const config = loadConfig();
  if (config.track !== "quick") {
    console.log(chalk.yellow("Switching to quick track phases 07-09 for this session."));
  }
  runPhase(7);
}

export function runDiscoverResume(): void {
  const registry = loadRegistry();
  const current = registry.discovery?.current_phase;
  if (!current) {
    const config = loadConfig();
    const phases = getPhasesForTrack(config.track);
    runPhase(phases[0]);
    return;
  }
  runPhase(current);
}

export function runPhase(phaseNum: number): void {
  const config = loadConfig();
  const phases = getPhasesForTrack(config.track);
  if (!phases.includes(phaseNum)) {
    console.error(chalk.red(`Phase ${phaseNum} not in track ${config.track}`));
    process.exit(1);
  }

  const { specxDir, projectRoot } = getRoots();
  const file = phaseFile(phaseNum);
  if (!file) {
    console.error(chalk.red(`Unknown phase: ${phaseNum}`));
    process.exit(1);
  }

  const outPath = path.join(specxDir, "discovery", file);
  const critiquePath = path.join(
    specxDir,
    "discovery",
    "critiques",
    file.replace(".md", "-critique.md")
  );

  const vars = defaultVars(
    config.project?.name ?? path.basename(projectRoot),
    config.track
  );

  if (!fs.existsSync(outPath)) {
    try {
      writeFromTemplate(
        path.join("specx", "discovery", file),
        outPath,
        vars
      );
    } catch {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(
        outPath,
        `# Phase ${phaseNum}\n\n<!-- Complete specialist output here -->\n`,
        "utf8"
      );
    }
  }

  fs.mkdirSync(path.dirname(critiquePath), { recursive: true });
  if (!fs.existsSync(critiquePath)) {
    fs.writeFileSync(
      critiquePath,
      `# Critique — Phase ${phaseNum}\n\n<!-- Critic agent output -->\n`,
      "utf8"
    );
  }

  let registry = loadRegistry();
  const key = phaseKey(phaseNum);
  registry = {
    ...registry,
    discovery: {
      ...registry.discovery,
      current_phase: phaseNum,
      phases: {
        ...registry.discovery?.phases,
        [key]: { status: "in_progress" },
      },
    },
  };
  saveRegistry(registry);

  console.log(chalk.green(`Phase ${phaseNum} scaffolded:`));
  console.log(`  ${outPath}`);
  console.log(`  ${critiquePath}`);
  console.log(chalk.dim("\nRun Specialist then Critic agents. Human approves with: specx approve"));
}

export function runApprove(): void {
  const registry = loadRegistry();
  const phase = registry.discovery?.current_phase;
  if (!phase) {
    console.error(chalk.red("No active discovery phase."));
    process.exit(1);
  }

  const key = phaseKey(phase);
  const { specxDir } = getRoots();
  const file = phaseFile(phase);
  const outPath = path.join(specxDir, "discovery", file!);

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
          status: "approved" as const,
          approved_at: new Date().toISOString(),
        },
      },
    },
  };
  saveRegistry(updated);
  appendAudit("discovery.approve", { phase, key });

  const config = loadConfig();
  const phases = getPhasesForTrack(config.track);
  const idx = phases.indexOf(phase);
  if (idx >= 0 && idx < phases.length - 1) {
    const next = phases[idx + 1];
    saveRegistry({
      ...updated,
      discovery: { ...updated.discovery, current_phase: next },
    });
    console.log(chalk.green(`Phase ${phase} approved. Next: phase ${next}`));
  } else {
    console.log(chalk.green(`Phase ${phase} approved. Discovery complete for track.`));
  }

  printGitHint([
    path.join("specx", "discovery", file!),
    ".specx/registry.yaml",
  ]);
}

export function runRevise(): void {
  const registry = loadRegistry();
  const phase = registry.discovery?.current_phase;
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
        [key]: { status: "revision" },
      },
    },
  });
  console.log(chalk.yellow(`Phase ${phase} marked for revision.`));
}
