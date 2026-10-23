import fs from "node:fs";
import path from "node:path";
import { getRoots, resolvePackageTemplates } from "./paths.js";
import { substitute, type TemplateVars } from "./template.js";
import { AGENT_HOSTS, type AgentHost } from "../../schemas/specx-config.js";

const SKILLS = ["discover", "specify", "propose", "approve", "plan", "execute", "review", "resume"] as const;
const ALL_MANAGED_SKILLS = [
  ...SKILLS.map((skill) => `specx-${skill}`),
  "specx-archive", "specx-build", "specx-critic", "specx-design", "specx-revise",
  "specx-graph", "specx-sdd", "specx-spec", "specx-specialist", "specx-tasks", "specx-verify",
];
const AGENT_LABELS: Record<AgentHost, string> = {
  codex: "Codex",
  claude: "Claude Code",
  cursor: "Cursor",
  copilot: "GitHub Copilot",
};
const DESCRIPTION: Record<string, string> = {
  discover: "Inventory an application and draft evidence-linked project knowledge for user review.",
  specify: "Research and author the complete target project blueprint with the user before implementation planning.",
  propose: "Draft a reviewable change to project knowledge without accepting it.",
  approve: "Record an explicit user decision on a knowledge proposal.",
  plan: "Create a milestone-based delivery roadmap from an approved, ready project blueprint.",
  execute: "Execute one approved task on a task branch within its authorized scope.",
  review: "Review task changes against approved specifications before human merge approval.",
  resume: "Resume long-running SpecX work from the repository checkpoint.",
};

export function parseAgentSelection(value: string): AgentHost[] {
  const selected = value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (selected.length === 0) throw new Error("Select at least one agent integration.");
  const invalid = selected.filter((item) => !AGENT_HOSTS.includes(item as AgentHost));
  if (invalid.length) throw new Error(`Unknown agent(s): ${invalid.join(", ")}. Choose from: ${AGENT_HOSTS.join(", ")}.`);
  return [...new Set(selected as AgentHost[])];
}

export function agentLabel(agent: AgentHost): string {
  return AGENT_LABELS[agent];
}

function cleanupSkillTree(destination: string): void {
  if (!fs.existsSync(destination)) return;
  for (const name of ALL_MANAGED_SKILLS) {
    const target = path.join(destination, name);
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  }
}

function removeManagedSection(file: string, marker: string): void {
  if (!fs.existsSync(file)) return;
  const begin = `<!-- specx:${marker}:begin -->`;
  const end = `<!-- specx:${marker}:end -->`;
  const existing = fs.readFileSync(file, "utf8");
  const start = existing.indexOf(begin);
  const finish = start < 0 ? -1 : existing.indexOf(end, start + begin.length);
  if (start < 0 || finish < 0) return;
  const next = `${existing.slice(0, start)}${existing.slice(finish + end.length)}`.trim();
  if (next) fs.writeFileSync(file, `${next}\n`, "utf8");
  else fs.rmSync(file, { force: true });
}

function removeKnownCommands(directory: string, names: string[]): void {
  if (!fs.existsSync(directory)) return;
  for (const name of names) fs.rmSync(path.join(directory, name), { force: true });
}

function writeManagedSection(file: string, marker: string, body: string): void {
  const begin = `<!-- specx:${marker}:begin -->`;
  const end = `<!-- specx:${marker}:end -->`;
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const section = `${begin}\n${body.trim()}\n${end}`;
  const start = existing.indexOf(begin);
  const finish = start < 0 ? -1 : existing.indexOf(end, start + begin.length);
  let next = start >= 0 && finish >= 0
    ? `${existing.slice(0, start)}${section}${existing.slice(finish + end.length)}`
    : `${existing.trimEnd()}${existing ? "\n\n" : ""}${section}\n`;
  if (!existing && marker === "agents") next = `# AGENTS.md\n\n${section}\n`;
  if (marker === "agents" && existing.includes("no spec tree") && existing.includes("Plane")) next = `# AGENTS.md\n\n${section}\n`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next, "utf8");
}

function syncSkillTree(source: string, destination: string, vars: TemplateVars): void {
  fs.mkdirSync(destination, { recursive: true });
  for (const name of fs.readdirSync(destination)) {
    if (ALL_MANAGED_SKILLS.includes(name) && !SKILLS.some((skill) => name === `specx-${skill}`)) {
      fs.rmSync(path.join(destination, name), { recursive: true, force: true });
    }
  }
  for (const skill of SKILLS) {
    const name = `specx-${skill}`;
    const from = path.join(source, name);
    const to = path.join(destination, name);
    if (!fs.existsSync(from)) throw new Error(`Missing bundled skill: ${from}`);
    fs.mkdirSync(to, { recursive: true });
    for (const file of fs.readdirSync(from)) {
      fs.writeFileSync(path.join(to, file), substitute(fs.readFileSync(path.join(from, file), "utf8"), vars), "utf8");
    }
  }
}

function readTemplate(rel: string, vars: TemplateVars): string {
  return substitute(fs.readFileSync(path.join(resolvePackageTemplates(), rel), "utf8"), vars);
}

export function generateAgentIntegrations(projectRoot?: string, vars?: TemplateVars, selectedHosts: AgentHost[] = [...AGENT_HOSTS]): string[] {
  const { projectRoot: root } = getRoots(projectRoot);
  const templates = resolvePackageTemplates();
  const sourceSkills = path.join(templates, ".agents", "skills");
  const v = vars ?? { PROJECT_NAME: path.basename(root), STACK: "Unknown", DATE: new Date().toISOString().slice(0, 10) };
  const selected = new Set(selectedHosts);
  const written: string[] = [];

  const skillHosts: Record<AgentHost, string> = {
    codex: ".agents/skills",
    claude: ".claude/skills",
    cursor: ".cursor/skills",
    copilot: ".github/skills",
  };
  for (const host of AGENT_HOSTS) {
    const destination = path.join(root, skillHosts[host]);
    if (!selected.has(host)) {
      try { cleanupSkillTree(destination); }
      catch (err) {
        if (host !== "codex" || !["EACCES", "EPERM"].includes((err as NodeJS.ErrnoException).code ?? "")) throw err;
        console.warn(`Could not remove deselected Codex skills from read-only directory: ${destination}`);
      }
      continue;
    }
    try {
      syncSkillTree(sourceSkills, destination, v);
      written.push(destination);
    } catch (err) {
      if (host !== "codex" || !["EACCES", "EPERM"].includes((err as NodeJS.ErrnoException).code ?? "")) throw err;
      console.warn(`Skipping read-only Codex skills directory: ${destination}`);
    }
  }

  const specxRules = path.join(root, ".specx", "AGENTS.md");
  fs.mkdirSync(path.dirname(specxRules), { recursive: true });
  const freshRules = readTemplate(".specx/AGENTS.md", v);
  const previousRules = fs.existsSync(specxRules) ? fs.readFileSync(specxRules, "utf8") : "";
  if (!previousRules || (previousRules.includes("Work items live in") && previousRules.includes("Plane"))) fs.writeFileSync(specxRules, freshRules, "utf8");
  else if (!previousRules.includes("## Canonical record")) fs.writeFileSync(specxRules, `${previousRules.trimEnd()}\n\n${freshRules}`, "utf8");
  written.push(specxRules);

  const rules = "Read specx/Home.md, specx/specifications/README.md, and .specx/AGENTS.md. The repository-local Markdown blueprint is canonical. Keep source-verified current behavior separate from user-approved target specifications. Proposed, inferred, disputed, and unresolved content is not accepted truth. Discover first; specify the target with the user; assess and approve blueprint readiness before planning phases, milestones, and tasks. Ask before resolving missing decisions or expanding scope. Execute one approved task per branch, run its checks, and present the diff for human review. A human approves merge.";
  const agentsFile = path.join(root, "AGENTS.md");
  writeManagedSection(agentsFile, "agents", rules);
  written.push(agentsFile);

  const copilotFile = path.join(root, ".github", "copilot-instructions.md");
  if (selected.has("copilot")) {
    writeManagedSection(copilotFile, "copilot", "Read AGENTS.md, specx/Home.md, specx/specifications/README.md, and .specx/AGENTS.md. Use the relevant skill in .github/skills/. Keep current-state evidence separate from the target blueprint. Follow blueprint-readiness and separate roadmap-approval gates; do not promote proposals or make missing decisions. Execute one approved task per branch, run checks, and present changes for human merge review. This section supersedes older Plane-based SpecX instructions.");
    written.push(copilotFile);
  } else removeManagedSection(copilotFile, "copilot");

  const cursorRule = path.join(root, ".cursor", "rules", "specx.mdc");
  if (selected.has("cursor")) {
    fs.mkdirSync(path.dirname(cursorRule), { recursive: true });
    fs.writeFileSync(cursorRule, `---\ndescription: SpecX blueprint, delivery, and user approval rules\nglobs:\nalwaysApply: true\n---\n\n${rules}\nUse the relevant skill in .cursor/skills/.\n`, "utf8");
    written.push(cursorRule);
  } else if (fs.existsSync(cursorRule) && /^---\ndescription: SpecX (?:project knowledge and user approval|blueprint, delivery, and user approval) rules/m.test(fs.readFileSync(cursorRule, "utf8"))) {
    fs.rmSync(cursorRule, { force: true });
  }

  const claudeCommands = path.join(root, ".claude", "commands", "specx");
  const cursorCommands = path.join(root, ".cursor", "commands");
  const validClaude = new Set(SKILLS.map((skill) => `${skill}.md`));
  const validCursor = new Set(SKILLS.map((skill) => `specx-${skill}.md`));
  if (selected.has("claude")) {
    fs.mkdirSync(claudeCommands, { recursive: true });
    const managedClaudeCommands = [
      ...SKILLS.map((skill) => `${skill}.md`),
      "archive.md", "build.md", "critic.md", "design.md", "revise.md", "spec.md", "specialist.md", "tasks.md", "verify.md",
    ];
    for (const name of managedClaudeCommands) if (!validClaude.has(name)) fs.rmSync(path.join(claudeCommands, name), { force: true });
    for (const skill of SKILLS) {
      const name = `specx-${skill}`;
      fs.writeFileSync(path.join(claudeCommands, `${skill}.md`), `---\ndescription: ${DESCRIPTION[skill]}\n---\n\nRead and follow .claude/skills/${name}/SKILL.md completely. Preserve its approval gates.\n`, "utf8");
    }
    written.push(claudeCommands);
  } else {
    removeKnownCommands(claudeCommands, [...SKILLS.map((skill) => `${skill}.md`), "archive.md", "build.md", "critic.md", "design.md", "revise.md", "spec.md", "specialist.md", "tasks.md", "verify.md"]);
  }
  if (selected.has("cursor")) {
    fs.mkdirSync(cursorCommands, { recursive: true });
    for (const name of fs.readdirSync(cursorCommands)) {
      const managed = ALL_MANAGED_SKILLS.map((skill) => `${skill}.md`);
      if (managed.includes(name) && !validCursor.has(name)) fs.rmSync(path.join(cursorCommands, name), { force: true });
    }
    for (const skill of SKILLS) {
      const name = `specx-${skill}`;
      fs.writeFileSync(path.join(cursorCommands, `${name}.md`), `---\ndescription: ${DESCRIPTION[skill]}\n---\n\nRead and follow .cursor/skills/${name}/SKILL.md completely. Preserve its approval gates.\n`, "utf8");
    }
    written.push(cursorCommands);
  } else {
    removeKnownCommands(cursorCommands, ALL_MANAGED_SKILLS.map((skill) => `${skill}.md`));
  }

  const specxCommands = path.join(root, ".specx", "commands");
  fs.mkdirSync(specxCommands, { recursive: true });
  for (const skill of SKILLS) {
    const name = `specx-${skill}`;
    fs.writeFileSync(path.join(specxCommands, `${skill}.md`), `# SpecX ${skill}\n\nRead and follow .agents/skills/${name}/SKILL.md completely. Preserve all user approval gates.\n`, "utf8");
  }
  written.push(specxCommands);
  return written;
}
