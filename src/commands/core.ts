import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { execSync } from "node:child_process";
import { loadConfig } from "../lib/config.js";
import { getRoots } from "../lib/paths.js";
import { generateAgentIntegrations } from "../lib/agents.js";

function markdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? markdownFiles(full) : entry.name.endsWith(".md") ? [full] : [];
  });
}

export async function runStatus(): Promise<void> {
  const config = loadConfig();
  const { projectRoot, specxDir } = getRoots();
  const files = markdownFiles(specxDir);
  const proposed = files.filter((file) => {
    if (!file.toLowerCase().includes(`${path.sep}proposals${path.sep}`)) return false;
    if (/README|TEMPLATE/i.test(path.basename(file))) return false;
    return /state:\s*proposed/i.test(fs.readFileSync(file, "utf8"));
  }).length;
  const indexFile = path.join(specxDir, "knowledge", "README.md");
  const unresolved = fs.existsSync(indexFile)
    ? (fs.readFileSync(indexFile, "utf8").match(/\| unresolved \|/gi) ?? []).length
    : 0;
  const checkpoint = path.join(specxDir, "work", "CHECKPOINT.md");
  console.log(chalk.bold("\nspecX project status"));
  console.log(`  Project: ${config.project.name ?? path.basename(projectRoot)}`);
  console.log(`  Root:    ${projectRoot}`);
  console.log(`  Knowledge files: ${files.length}`);
  console.log(`  Pending proposals: ${proposed}`);
  console.log(`  Unresolved knowledge areas: ${unresolved}`);
  console.log(`  Checkpoint: ${fs.existsSync(checkpoint) ? "available" : "not started"}`);
  console.log(chalk.dim("\n  Canonical record: specx/ (Markdown in this repository)\n"));
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
  } else console.log(fs.readFileSync(configPath, "utf8"));
}

export async function runOnboard(): Promise<void> {
  const { projectRoot, specxDir, dotSpecxDir } = getRoots();
  const config = loadConfig();
  const files = [
    path.join(specxDir, "Home.md"),
    path.join(dotSpecxDir, "AGENTS.md"),
    path.join(specxDir, "work", "CHECKPOINT.md"),
  ];
  console.log([
    `# specX context: ${config.project.name ?? path.basename(projectRoot)}`,
    "",
    "The repository-local Markdown blueprint is canonical. Keep source-verified current behavior separate from user-approved target specifications.",
    "Discover the existing system, then use a frontier model with the user to specify the target. Do not write application code during these stages.",
    "Assess and approve blueprint readiness before creating a phased milestone roadmap. Approve the exact roadmap before task execution.",
    "Execute only one approved, unblocked task per branch; run its checks and review the diff. A human approves merge.",
    "",
    ...files.flatMap((file) => fs.existsSync(file) ? [fs.readFileSync(file, "utf8")] : []),
  ].join("\n"));
}

export function runUpdate(): void {
  const config = loadConfig();
  const selectedAgents = config.integrations?.agents;
  if (!selectedAgents?.length) {
    throw new Error("No agent selection is saved in .specx/specx.yaml. Run `specx init` and choose the agents you use.");
  }
  const written = generateAgentIntegrations(undefined, undefined, selectedAgents);
  console.log(chalk.green("Agent integrations updated:"));
  console.log(`  Selected: ${selectedAgents.join(", ")}`);
  for (const item of written) console.log(`  ${item}`);
}
