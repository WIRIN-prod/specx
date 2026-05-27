import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { execSync } from "node:child_process";
import { SpecxConfigSchema, TRACK_PHASES } from "../../schemas/specx-config.js";
import { defaultRegistry } from "../../schemas/registry.js";
import { loadConfig, saveConfig } from "../lib/config.js";
import { loadRegistry, saveRegistry } from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { getFeatureDir } from "../lib/features.js";
import { generateAgentIntegrations } from "../lib/agents.js";
import {
  printFeaturesStatus,
  printDiscoveryStatus,
  printFoundationStatus,
} from "../lib/status-display.js";
import { runPropose } from "./build.js";
import { runPhase } from "./discovery.js";

export function runStatus(): void {
  const config = loadConfig();
  const registry = loadRegistry();
  const { specxDir } = getRoots();

  console.log(chalk.bold("\nspecX status"));
  console.log(`  Project: ${config.project?.name ?? "—"}`);
  console.log(`  Root: ${specxDir.replace(/\/specx$/, "")}`);

  printDiscoveryStatus(config, registry, specxDir);
  printFoundationStatus(config, specxDir);
  printFeaturesStatus(registry, specxDir);
  console.log();
}

export function runConfig(openEditor: boolean): void {
  const { dotSpecxDir } = getRoots();
  const configPath = path.join(dotSpecxDir, "specx.yaml");
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red("No specx.yaml. Run specx init first."));
    process.exit(1);
  }
  if (openEditor) {
    const editor = process.env.EDITOR ?? "vi";
    execSync(`${editor} "${configPath}"`, { stdio: "inherit" });
  } else {
    console.log(fs.readFileSync(configPath, "utf8"));
  }
}

export function runTrack(trackName: string): void {
  const parsed = SpecxConfigSchema.shape.track.safeParse(trackName);
  if (!parsed.success) {
    console.error(chalk.red("Track must be quick, standard, or enterprise"));
    process.exit(1);
  }
  const config = loadConfig();
  saveConfig({ ...config, track: parsed.data });
  saveRegistry(defaultRegistry(TRACK_PHASES[parsed.data]));
  console.log(chalk.green(`Track set to ${parsed.data}`));
}

export function runOnboard(): void {
  const { specxDir, dotSpecxDir } = getRoots();
  const parts: string[] = ["# specX onboard context\n"];

  const specxMd = path.join(specxDir, "SPECX.md");
  if (fs.existsSync(specxMd)) {
    parts.push("## SPECX.md\n", fs.readFileSync(specxMd, "utf8").slice(0, 8000));
  }

  const steering = path.join(specxDir, "foundation", "STEERING.md");
  if (fs.existsSync(steering)) {
    parts.push("\n## STEERING.md\n", fs.readFileSync(steering, "utf8").slice(0, 4000));
  }

  const registryPath = path.join(dotSpecxDir, "registry.yaml");
  if (fs.existsSync(registryPath)) {
    parts.push("\n## registry.yaml\n", fs.readFileSync(registryPath, "utf8"));
  }

  const registry = loadRegistry();
  const active = registry.features?.active ?? registry.changes?.active;
  if (active) {
    const featureDir = getFeatureDir(specxDir, active);
    for (const f of ["FEATURE.md", "proposal.md", "spec.md", "tasks.md"]) {
      const p = path.join(featureDir, f);
      if (fs.existsSync(p)) {
        parts.push(`\n## ${active}/${f}\n`, fs.readFileSync(p, "utf8").slice(0, 3000));
      }
    }
  }

  console.log(parts.join("\n"));
}

export function runUpdate(): void {
  const written = generateAgentIntegrations();
  console.log(chalk.green("Agent integrations updated:"));
  for (const w of written) console.log(`  ${w}`);
}

export function runRun(options: {
  prompt?: string;
  phase?: string;
  input?: string;
  propose?: string;
  autoApprove?: boolean;
}): void {
  if (options.propose) {
    runPropose(options.propose, options.input);
    if (options.autoApprove) {
      console.log(chalk.dim("(auto-approve: complete artifacts manually in CI)"));
    }
    return;
  }
  if (options.phase) {
    runPhase(parseInt(options.phase, 10));
    return;
  }
  if (options.prompt) {
    console.log(`# specx run\n\n${options.prompt}\n`);
    console.log(chalk.dim("Use your AI agent with specx/SPECX.md context."));
    return;
  }
  console.error(chalk.red("Provide --phase, --propose, or -p"));
  process.exit(1);
}
