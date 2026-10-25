#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import chalk from "chalk";
import { runInit } from "./commands/init.js";
import { runStatus, runConfig, runTasks, runUpdate } from "./commands/core.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(here, here.endsWith("dist") ? ".." : "../..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const program = new Command();
program.name("specx").description("Plan, execute, and review software with AI agents. The user decides; agents execute.").version(pkg.version);
function run(fn: (...args: never[]) => Promise<void> | void) {
  return async (...args: unknown[]) => {
    try { await fn(...(args as never[])); }
    catch (err) { console.error(chalk.red(`\n${(err as Error).message}\n`)); process.exit(1); }
  };
}
program.command("init").description("Create the specx/ record and install rules and skills for the selected agents")
  .argument("[path]", "project directory", ".")
  .option("--agents <list>", "Comma-separated agents: codex,claude,cursor,copilot")
  .action(run((p: string, opts: { agents?: string }) => runInit(p, opts.agents, true)));
program.command("update").description("Regenerate SpecX rules and skills for the saved agents").action(run(runUpdate));
program.command("status").description("Summarize specs, decisions, and tasks").action(run(runStatus));
program.command("tasks").description("Validate the task list and show tasks ready to run in parallel")
  .option("--write", "Regenerate specx/tasks/TASKS.md from the task files")
  .option("--related <id>", "List tasks that must pause with this task")
  .action(run((opts: { write?: boolean; related?: string }) => runTasks(opts)));
program.command("config").description("Show or edit .specx/specx.yaml").option("--edit", "Open in $EDITOR").action((opts) => runConfig(!!opts.edit));
program.parse();
