import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { getPhasesForTrack, loadConfig } from "../lib/config.js";
import { loadRegistry, saveRegistry, phaseKey } from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { writeFromTemplate, defaultVars } from "../lib/template.js";
import {
  DISCOVERY_PHASES,
  formatPhaseLabel,
  phaseFile,
} from "../lib/discovery-phases.js";
import {
  analyzeFeatureImpact,
  formatDiscoveryImpactReport,
} from "../lib/discovery-impact.js";
import { resolveFeature } from "../lib/features.js";

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

export function runDiscoverImpact(featurePath?: string): void {
  const config = loadConfig();
  const path = featurePath ? resolveFeature(featurePath) : resolveFeature();
  const impacts = analyzeFeatureImpact(path, config.track);
  console.log(
    formatDiscoveryImpactReport(path, impacts, config.track)
  );
}

export { runApprove, runRevise } from "./gates.js";
