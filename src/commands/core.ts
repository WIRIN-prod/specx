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
    "The repository-local Markdown knowledge base is canonical. Read its status and provenance before acting.",
    "Proposed, inferred, or unresolved knowledge is not approved truth. Stop for user decisions.",
    "Execute only approved plans and review code changes before merge.",
    "",
    ...files.flatMap((file) => fs.existsSync(file) ? [fs.readFileSync(file, "utf8")] : []),
  ].join("\n"));
}

export function runUpdate(): void {
  const written = generateAgentIntegrations();
  console.log(chalk.green("Agent integrations updated:"));
  for (const item of written) console.log(`  ${item}`);
}
