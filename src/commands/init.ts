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
  fs.mkdirSync(path.join(projectRoot, ".specx"), { recursive: true });
  const configPath = path.join(projectRoot, ".specx", "specx.yaml");
  saveConfig(SpecxConfigSchema.parse({
    ...previousConfig,
    project: { ...previousConfig.project, name: previousConfig.project.name ?? projectName },
    integrations: { ...previousConfig.integrations, agents: selectedAgents },
  }), projectRoot);
  copyFromPackageTemplates("specx", path.join(projectRoot, "specx"), vars, { overwrite: false });
  ensureGitignore(projectRoot);
  const agents = generateAgentIntegrations(projectRoot, vars, selectedAgents);
  spinner.succeed("specX initialized");
  console.log(chalk.dim("\nCreated or preserved:"));
  console.log(`  ${configPath}`);
  console.log(`  ${path.join(projectRoot, "specx", "Home.md")}`);
  console.log(`  ${path.join(projectRoot, "specx", "knowledge", "README.md")}`);
  console.log(chalk.dim(`\nSelected agent integrations: ${selectedAgents.map(agentLabel).join(", ")}`));
  console.log(chalk.dim("\nAgent integrations:"));
  for (const item of agents) console.log(`  ${item}`);
  console.log(chalk.bold("\nNext:"));
  console.log("  1. Run /specx:discover to survey the existing implementation and review its evidence-linked proposal.");
  console.log("  2. Run /specx:specify with a frontier model to research and write the target blueprint with you; approve the exact revision.");
  console.log("  3. Assess blueprint readiness, then create and approve a milestone roadmap before implementation.");
  console.log("  4. Let implementation agents execute one approved task per branch, verify and review it; a human approves merge.\n");
}
