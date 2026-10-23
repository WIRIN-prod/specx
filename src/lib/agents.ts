import fs from "node:fs";
import path from "node:path";
import { getRoots, resolvePackageTemplates } from "./paths.js";
import { substitute, type TemplateVars } from "./template.js";

const SKILLS = ["discover", "propose", "approve", "plan", "execute", "review", "resume"] as const;
const DESCRIPTION: Record<string, string> = {
  discover: "Inventory an application and draft evidence-linked project knowledge for user review.",
  propose: "Draft a reviewable change to project knowledge without accepting it.",
  approve: "Record an explicit user decision on a knowledge proposal.",
  plan: "Create a phased, dependency-aware plan from approved knowledge.",
  execute: "Execute one approved task within its authorized scope.",
  review: "Review code and knowledge changes before merge.",
  resume: "Resume long-running SpecX work from the repository checkpoint.",
};

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
    if (name.startsWith("specx-") && !SKILLS.some((skill) => name === `specx-${skill}`)) {
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

export function generateAgentIntegrations(projectRoot?: string, vars?: TemplateVars): string[] {
  const { projectRoot: root } = getRoots(projectRoot);
  const templates = resolvePackageTemplates();
  const sourceSkills = path.join(templates, ".agents", "skills");
  const v = vars ?? { PROJECT_NAME: path.basename(root), STACK: "Unknown", DATE: new Date().toISOString().slice(0, 10) };
  const written: string[] = [];

  for (const host of [".agents/skills", ".claude/skills", ".cursor/skills", ".github/skills"]) {
    const destination = path.join(root, host);
    try {
      syncSkillTree(sourceSkills, destination, v);
      written.push(destination);
    } catch (err) {
      if (host !== ".agents/skills" || !["EACCES", "EPERM"].includes((err as NodeJS.ErrnoException).code ?? "")) throw err;
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

  const rules = "Read specx/Home.md and .specx/AGENTS.md. The repository-local Markdown knowledge base is canonical. Proposed, inferred, disputed, and unresolved content is not accepted truth. Ask the user before resolving missing decisions, changing accepted knowledge, or expanding approved scope. Execute only tasks in an explicitly approved plan. Present code changes for human review before merge.";
  const agentsFile = path.join(root, "AGENTS.md");
  writeManagedSection(agentsFile, "agents", rules);
  written.push(agentsFile);

  const copilotFile = path.join(root, ".github", "copilot-instructions.md");
  writeManagedSection(copilotFile, "copilot", "Read AGENTS.md, specx/Home.md, and .specx/AGENTS.md. Use the relevant skill in .github/skills/. Follow the explicit user approval gates; do not promote proposals or make missing decisions. Execute only approved plans and present changes for review before merge. This section supersedes older Plane-based SpecX instructions.");
  written.push(copilotFile);

  const cursorRule = path.join(root, ".cursor", "rules", "specx.mdc");
  fs.mkdirSync(path.dirname(cursorRule), { recursive: true });
  fs.writeFileSync(cursorRule, `---\ndescription: SpecX project knowledge and user approval rules\nglobs:\nalwaysApply: true\n---\n\n${rules}\nUse the relevant skill in .cursor/skills/.\n`, "utf8");
  written.push(cursorRule);

  const claudeCommands = path.join(root, ".claude", "commands", "specx");
  const cursorCommands = path.join(root, ".cursor", "commands");
  fs.mkdirSync(claudeCommands, { recursive: true });
  fs.mkdirSync(cursorCommands, { recursive: true });
  const validClaude = new Set(SKILLS.map((skill) => `${skill}.md`));
  for (const name of fs.readdirSync(claudeCommands)) if (!validClaude.has(name)) fs.rmSync(path.join(claudeCommands, name), { force: true });
  const validCursor = new Set(SKILLS.map((skill) => `specx-${skill}.md`));
  for (const name of fs.readdirSync(cursorCommands)) if (name.startsWith("specx-") && !validCursor.has(name)) fs.rmSync(path.join(cursorCommands, name), { force: true });
  for (const skill of SKILLS) {
    const name = `specx-${skill}`;
    fs.writeFileSync(path.join(claudeCommands, `${skill}.md`), `---\ndescription: ${DESCRIPTION[skill]}\n---\n\nRead and follow .claude/skills/${name}/SKILL.md completely. Preserve its approval gates.\n`, "utf8");
    fs.writeFileSync(path.join(cursorCommands, `${name}.md`), `---\ndescription: ${DESCRIPTION[skill]}\n---\n\nRead and follow .cursor/skills/${name}/SKILL.md completely. Preserve its approval gates.\n`, "utf8");
  }
  written.push(claudeCommands, cursorCommands);

  const specxCommands = path.join(root, ".specx", "commands");
  fs.mkdirSync(specxCommands, { recursive: true });
  for (const skill of SKILLS) {
    const name = `specx-${skill}`;
    fs.writeFileSync(path.join(specxCommands, `${skill}.md`), `# SpecX ${skill}\n\nRead and follow .agents/skills/${name}/SKILL.md completely. Preserve all user approval gates.\n`, "utf8");
  }
  written.push(specxCommands);
  return written;
}
