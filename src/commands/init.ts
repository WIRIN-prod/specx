import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import {
  SpecxConfigSchema,
  TRACK_FOUNDATION,
  TRACK_PHASES,
  type SpecxConfig,
} from "../../schemas/specx-config.js";
import { defaultRegistry } from "../../schemas/registry.js";
import { saveConfig } from "../lib/config.js";
import { saveRegistry } from "../lib/registry.js";
import { copyFromPackageTemplates, defaultVars } from "../lib/template.js";
import { generateAgentIntegrations } from "../lib/agents.js";
import { resolvePackageTemplates } from "../lib/paths.js";

export async function runInit(
  targetPath: string,
  track: SpecxConfig["track"]
): Promise<void> {
  const projectRoot = path.resolve(targetPath);
  const projectName = path.basename(projectRoot);
  const vars = defaultVars(projectName, track);

  const spinner = ora("Initializing specX").start();

  if (!fs.existsSync(resolvePackageTemplates())) {
    spinner.fail("Templates not found. Run npm run build first.");
    process.exit(1);
  }

  copyFromPackageTemplates(".specx", path.join(projectRoot, ".specx"), vars);
  copyFromPackageTemplates("specx", path.join(projectRoot, "specx"), vars);

  const config = SpecxConfigSchema.parse({
    track,
    project: { name: projectName, stack: "TBD" },
    gates:
      track === "enterprise"
        ? {
            discovery: { approvers_required: 2 },
            build: { review_before_archive: true, approvers_required: 1 },
          }
        : undefined,
    evolution: { audit: track === "enterprise", drift_schedule: "manual" },
    team: track === "enterprise" ? { rbac_enabled: true } : undefined,
  });

  saveConfig(config, projectRoot);

  const phases = TRACK_PHASES[track];
  saveRegistry(defaultRegistry(phases), projectRoot);

  for (const file of TRACK_FOUNDATION[track]) {
    const p = path.join(projectRoot, "specx", "foundation", file);
    if (!fs.existsSync(p)) {
          fs.mkdirSync(path.dirname(p), { recursive: true });
          fs.writeFileSync(p, `# ${file}\n\n<!-- Generated for ${track} track -->\n`, "utf8");
        }
  }

  const agents = generateAgentIntegrations(projectRoot, vars);
  spinner.succeed(`specX initialized (${track} track)`);

  console.log(chalk.dim("\nCreated:"));
  console.log(`  ${path.join(projectRoot, "specx")}`);
  console.log(`  ${path.join(projectRoot, ".specx")}`);
  console.log(chalk.dim("\nAgent integrations:"));
  for (const a of agents) console.log(`  ${a}`);
  console.log(chalk.cyan(`\nNext: specx discover`));
}
