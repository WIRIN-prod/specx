import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { execSync } from "node:child_process";
import { loadConfig } from "../lib/config.js";
import { getRoots } from "../lib/paths.js";
import { generateAgentIntegrations } from "../lib/agents.js";
import { loadBoard, parallelGroups, readFrontmatter, readyTasks, relatedTasks, writeTaskIndex, type Task } from "../lib/tasks.js";

function specFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? specFiles(full) : entry.name.endsWith(".md") ? [full] : [];
  });
}

function countBy(values: string[]): string {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts.size ? [...counts].map(([key, n]) => `${n} ${key}`).join(", ") : "none";
}

function requireSpecx(specxDir: string): void {
  if (!fs.existsSync(specxDir)) throw new Error("No specx/ folder. Run specx init first.");
}

export async function runStatus(): Promise<void> {
  const config = loadConfig();
  const { projectRoot, specxDir } = getRoots();
  requireSpecx(specxDir);
  const specs = specFiles(path.join(specxDir, "specs"))
    .map((file) => { try { return readFrontmatter(file); } catch { return undefined; } })
    .filter((data) => data?.id)
    .map((data) => String(data?.status ?? "draft"));
  const board = loadBoard(specxDir);
  console.log(chalk.bold("\nspecX status"));
  console.log(`  Project:   ${config.project.name ?? path.basename(projectRoot)}`);
  console.log(`  Specs:     ${countBy(specs)}`);
  console.log(`  Decisions: ${countBy([...board.decisions.values()])}`);
  console.log(`  Tasks:     ${countBy(board.tasks.map((task) => task.status))}`);
  console.log(`  Ready:     ${readyTasks(board).map((task) => task.id).join(", ") || "none"}`);
  if (board.problems.length) console.log(chalk.red(`  Problems:  ${board.problems.length} (run specx tasks)`));
  console.log("");
}

function line(task: Task): string {
  return `  ${task.id.padEnd(8)} ${task.status.padEnd(12)} ${task.title}`;
}

export async function runTasks(opts: { write?: boolean; related?: string }): Promise<void> {
  const { specxDir } = getRoots();
  requireSpecx(specxDir);
  const board = loadBoard(specxDir);
  if (opts.related) {
    const related = relatedTasks(board, opts.related);
    console.log(chalk.bold(`\nTasks to pause with ${opts.related}:`));
    console.log(related.length ? related.map(line).join("\n") : "  none");
    console.log("");
    return;
  }
  console.log(chalk.bold("\nTasks"));
  console.log(board.tasks.length ? board.tasks.map(line).join("\n") : "  none");
  const groups = parallelGroups(readyTasks(board));
  console.log(chalk.bold("\nReady to approve"));
  if (!groups.length) console.log("  none");
  groups.forEach((group, index) => console.log(`  group ${index + 1} (can run in parallel): ${group.map((task) => task.id).join(", ")}`));
  if (opts.write) console.log(chalk.dim(`\nUpdated ${writeTaskIndex(specxDir, board)}`));
  if (board.problems.length) {
    console.log(chalk.red("\nProblems"));
    for (const problem of board.problems) console.log(chalk.red(`  ${problem}`));
    process.exitCode = 1;
  }
  console.log("");
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

export function runUpdate(): void {
  const config = loadConfig();
  const selectedAgents = config.integrations?.agents;
  if (!selectedAgents?.length) {
    throw new Error("No agent selection is saved in .specx/specx.yaml. Run `specx init` and choose the agents you use.");
  }
  const written = generateAgentIntegrations(undefined, selectedAgents);
  console.log(chalk.green("Agent integrations updated:"));
  console.log(`  Selected: ${selectedAgents.join(", ")}`);
  for (const item of written) console.log(`  ${item}`);
}
