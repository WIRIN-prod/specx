import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { SpecxConfigSchema } from "../../schemas/specx-config.js";
import { saveConfig } from "../lib/config.js";
import { generateAgentIntegrations } from "../lib/agents.js";
import { resolvePackageTemplates } from "../lib/paths.js";
import { copyFromPackageTemplates, defaultVars } from "../lib/template.js";

function ensureGitignore(projectRoot: string): void {
  const file = path.join(projectRoot, ".gitignore");
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const entries = [".specx/audit.log", ".specx/cache/"];
  const missing = entries.filter((entry) => !existing.split(/\r?\n/).includes(entry));
  if (missing.length) {
    const prefix = existing === "" || existing.endsWith("\n") ? existing : `${existing}\n`;
    fs.writeFileSync(file, `${prefix}${prefix && !prefix.endsWith("\n\n") ? "\n" : ""}# specX local runtime data\n${missing.join("\n")}\n`, "utf8");
  }
}

export async function runInit(targetPath: string): Promise<void> {
  const projectRoot = path.resolve(targetPath);
  const projectName = path.basename(projectRoot);
  const vars = defaultVars(projectName);
  const spinner = ora("Initializing specX").start();
  if (!fs.existsSync(resolvePackageTemplates())) {
    spinner.fail("Templates not found. Run npm run build first.");
    process.exit(1);
  }
  fs.mkdirSync(path.join(projectRoot, ".specx"), { recursive: true });
  const configPath = path.join(projectRoot, ".specx", "specx.yaml");
  if (!fs.existsSync(configPath)) saveConfig(SpecxConfigSchema.parse({ project: { name: projectName } }), projectRoot);
  copyFromPackageTemplates("specx", path.join(projectRoot, "specx"), vars, { overwrite: false });
  ensureGitignore(projectRoot);
  const agents = generateAgentIntegrations(projectRoot, vars);
  spinner.succeed("specX initialized");
  console.log(chalk.dim("\nCreated or preserved:"));
  console.log(`  ${configPath}`);
  console.log(`  ${path.join(projectRoot, "specx", "Home.md")}`);
  console.log(`  ${path.join(projectRoot, "specx", "knowledge", "README.md")}`);
  console.log(chalk.dim("\nAgent integrations:"));
  for (const item of agents) console.log(`  ${item}`);
  console.log(chalk.bold("\nNext:"));
  console.log("  1. Run the SpecX discover skill to survey the product and prepare a proposal.");
  console.log("  2. Review and explicitly approve the knowledge proposal.");
  console.log("  3. Plan from approved knowledge; approve the plan before agents execute.\n");
}
