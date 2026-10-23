#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import chalk from "chalk";
import { runInit } from "./commands/init.js";
import { runStatus, runConfig, runOnboard, runUpdate } from "./commands/core.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(here, here.endsWith("dist") ? ".." : "../..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const program = new Command();
program.name("specx").description("User-approved project knowledge and agent workflow for Markdown-first software projects").version(pkg.version);
function run(fn: (...args: never[]) => Promise<void> | void) {
  return async (...args: unknown[]) => {
    try { await fn(...(args as never[])); }
    catch (err) { console.error(chalk.red(`\n${(err as Error).message}\n`)); process.exit(1); }
  };
}
program.command("init").description("Initialize a project knowledge base and selected agent integrations")
  .argument("[path]", "project directory", ".")
  .option("--agents <list>", "Comma-separated agents: codex,claude,cursor,copilot")
  .action(run((p: string, opts: { agents?: string }) => runInit(p, opts.agents, true)));
program.command("update").description("Regenerate SpecX agent integrations").action(runUpdate);
program.command("onboard").description("Print the project context and approval rules").action(run(runOnboard));
program.command("status").description("Summarize local knowledge and work checkpoint").action(run(runStatus));
program.command("config").description("Show or edit .specx/specx.yaml").option("--edit", "Open in $EDITOR").action((opts) => runConfig(!!opts.edit));
program.parse();
