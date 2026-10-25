import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import chalk from "chalk";
import ora from "ora";
import { AGENT_HOSTS, SpecxConfigSchema, type AgentHost } from "../../schemas/specx-config.js";
import { loadConfig, saveConfig } from "../lib/config.js";
import { agentLabel, generateAgentIntegrations, parseAgentSelection } from "../lib/agents.js";
import { resolvePackageTemplates } from "../lib/paths.js";
import { copyFromPackageTemplates, defaultVars } from "../lib/template.js";

async function promptForAgents(): Promise<AgentHost[]> {
  console.log(chalk.bold("\nWhich agent integrations do you use?"));
  console.log("Choose one or more by entering their IDs separated by commas:");
  AGENT_HOSTS.forEach((agent, index) => console.log(`  ${index + 1}. ${agentLabel(agent)} (${agent})`));
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await prompt.question("Agents: ");
    const ids = answer.split(",").map((item) => item.trim()).filter(Boolean).map((item) => {
      const index = Number(item);
      return Number.isInteger(index) && index >= 1 && index <= AGENT_HOSTS.length
        ? AGENT_HOSTS[index - 1]
        : item;
    });
    return parseAgentSelection(ids.join(","));
  } finally {
    prompt.close();
  }
}

export async function runInit(targetPath: string, agentsArgument?: string, requireSelection = false): Promise<void> {
  const projectRoot = path.resolve(targetPath);
  const projectName = path.basename(projectRoot);
  const vars = defaultVars(projectName);
  if (!fs.existsSync(resolvePackageTemplates())) {
    throw new Error("Templates not found. Run npm run build first.");
  }
  const previousConfig = loadConfig(projectRoot);
  let selectedAgents: AgentHost[];
  if (agentsArgument !== undefined) selectedAgents = parseAgentSelection(agentsArgument);
  else if (requireSelection && process.stdin.isTTY && process.stdout.isTTY) selectedAgents = await promptForAgents();
  else if (previousConfig.integrations?.agents) selectedAgents = previousConfig.integrations.agents;
  else if (requireSelection) throw new Error("Select agent integrations with `specx init --agents codex,claude,cursor,copilot` when running non-interactively.");
  else selectedAgents = [...AGENT_HOSTS];

  const spinner = ora("Initializing specX").start();
  saveConfig(SpecxConfigSchema.parse({
    ...previousConfig,
    project: { ...previousConfig.project, name: previousConfig.project.name ?? projectName },
    integrations: { ...previousConfig.integrations, agents: selectedAgents },
  }), projectRoot);
  copyFromPackageTemplates("specx", path.join(projectRoot, "specx"), vars, { overwrite: false });
  const written = generateAgentIntegrations(projectRoot, selectedAgents);
  spinner.succeed("specX initialized");
  console.log(chalk.dim(`\nSelected agent integrations: ${selectedAgents.map(agentLabel).join(", ")}`));
  for (const item of written) console.log(`  ${item}`);
  const legacy = ["knowledge", "proposals", "plans", "specifications", "work"].filter((dir) => fs.existsSync(path.join(projectRoot, "specx", dir)));
  if (legacy.length) {
    console.log(chalk.yellow(`\nFolders from an earlier SpecX version were left untouched: ${legacy.map((dir) => `specx/${dir}/`).join(", ")}`));
    console.log(chalk.yellow("SpecX no longer reads them. Delete them, or ask /specx:plan to turn them into specs."));
  }
  console.log(chalk.bold("\nNext:"));
  console.log("  /specx:plan     write specs for existing code or new work, answer decisions, approve tasks");
  console.log("  /specx:execute  build approved tasks in worktrees; merge by pull request after your approval");
  console.log("  /specx:review   review code for gaps, flaws, and missing use cases\n");
}
