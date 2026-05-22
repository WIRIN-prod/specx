import fs from "node:fs";
import path from "node:path";
import { getRoots, resolvePackageTemplates } from "./paths.js";
import { substitute, type TemplateVars } from "./template.js";

/** Maps skill folder name → .specx/commands filename (without .md) */
const SKILL_TO_COMMAND: Record<string, string> = {
  "specx-discover": "discover",
  "specx-propose": "propose",
  "specx-spec": "spec",
  "specx-design": "design",
  "specx-tasks": "tasks",
  "specx-build": "build",
  "specx-verify": "verify",
  "specx-archive": "archive",
  "specx-specialist": "specialist",
  "specx-critic": "critic",
  "specx-approve": "approve",
  "specx-revise": "revise",
};

export const COMMANDS = Object.entries(SKILL_TO_COMMAND).map(([skill, cmd]) => ({
  slash: `/specx:${cmd === "discover" ? "discover" : cmd}`,
  skill,
  cli: `specx ${cmd}`,
  file: cmd,
}));

function stripFrontmatter(content: string): string {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("---", 3);
  if (end === -1) return content;
  return content.slice(end + 3).trim();
}

function copyDirRecursive(src: string, dest: string, vars?: TemplateVars): void {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      copyDirRecursive(s, d, vars);
    } else {
      let content = fs.readFileSync(s, "utf8");
      if (vars) content = substitute(content, vars);
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.writeFileSync(d, content, "utf8");
    }
  }
}

function writeFromTemplateFile(
  templateRel: string,
  dest: string,
  vars: TemplateVars
): void {
  const src = path.join(resolvePackageTemplates(), templateRel);
  if (!fs.existsSync(src)) {
    throw new Error(`Agent template missing: ${src}`);
  }
  const content = substitute(fs.readFileSync(src, "utf8"), vars);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, "utf8");
}

function syncCommandsFromSkills(projectRoot: string, skillsDest: string): void {
  const commandsDest = path.join(projectRoot, ".specx", "commands");
  fs.mkdirSync(commandsDest, { recursive: true });

  for (const [skillName, cmdName] of Object.entries(SKILL_TO_COMMAND)) {
    const skillPath = path.join(skillsDest, skillName, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;
    const body = stripFrontmatter(fs.readFileSync(skillPath, "utf8"));
    const descMatch = fs.readFileSync(skillPath, "utf8").match(/description:\s*>?-\s*\n([\s\S]*?)(?=\n\w|\n---)/);
    const desc = descMatch
      ? descMatch[1].replace(/\n\s+/g, " ").trim()
      : `specX ${cmdName} workflow`;

    const cmdFile = `---
description: ${desc}
---

${body}
`;
    fs.writeFileSync(path.join(commandsDest, `${cmdName}.md`), cmdFile, "utf8");
  }
}

function generateCursorCommands(
  projectRoot: string,
  skillsDest: string
): string[] {
  const cursorCommandsDir = path.join(projectRoot, ".cursor", "commands");
  fs.mkdirSync(cursorCommandsDir, { recursive: true });
  const written: string[] = [];

  for (const [skillName, cmdName] of Object.entries(SKILL_TO_COMMAND)) {
    const skillPath = path.join(skillsDest, skillName, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;
    const body = stripFrontmatter(fs.readFileSync(skillPath, "utf8"));
    const slash = `/specx:${cmdName}`;

    const cursorCmd = `---
description: ${slash} — follow specX skill ${skillName}
---

# ${slash}

**Apply the full specX skill:** \`.cursor/skills/${skillName}/SKILL.md\`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

${body}
`;
    const out = path.join(cursorCommandsDir, `specx-${cmdName}.md`);
    fs.writeFileSync(out, cursorCmd, "utf8");
    written.push(out);
  }

  return written;
}

export function generateAgentIntegrations(
  projectRoot?: string,
  vars?: TemplateVars
): string[] {
  const { projectRoot: root } = getRoots(projectRoot);
  const tpl = resolvePackageTemplates();
  const written: string[] = [];
  const v = vars ?? {
    PROJECT_NAME: path.basename(root),
    TRACK: "enterprise",
    STACK: "TBD",
    DATE: new Date().toISOString().slice(0, 10),
  };

  writeFromTemplateFile(".specx/AGENTS.md", path.join(root, ".specx", "AGENTS.md"), v);
  written.push(path.join(root, ".specx", "AGENTS.md"));

  const skillsSrc = path.join(tpl, ".cursor", "skills");
  const skillsDest = path.join(root, ".cursor", "skills");
  copyDirRecursive(skillsSrc, skillsDest, v);
  written.push(skillsDest);

  syncCommandsFromSkills(root, skillsDest);

  const commandsDest = path.join(root, ".specx", "commands");
  if (fs.existsSync(commandsDest)) written.push(commandsDest);

  const cursorDir = path.join(root, ".cursor", "rules");
  fs.mkdirSync(cursorDir, { recursive: true });
  const rulePath = path.join(cursorDir, "specx.mdc");
  writeFromTemplateFile(".cursor/rules/specx.mdc", rulePath, v);
  written.push(rulePath);

  written.push(...generateCursorCommands(root, skillsDest));

  const rootAgents = path.join(root, "AGENTS.md");
  fs.writeFileSync(
    rootAgents,
    `# AGENTS.md\n\nThis project uses **specX**.\n\n- **Skills (primary):** \`.cursor/skills/specx-*/SKILL.md\` — full SDD playbooks\n- **Constitution:** [specx/SPECX.md](specx/SPECX.md)\n- **Rules:** [.specx/AGENTS.md](.specx/AGENTS.md)\n`,
    "utf8"
  );
  written.push(rootAgents);

  const copilotPath = path.join(root, ".github", "copilot-instructions.md");
  fs.mkdirSync(path.dirname(copilotPath), { recursive: true });
  fs.writeFileSync(
    copilotPath,
    `# Copilot — specX\n\nFollow skills in \`.cursor/skills/specx-sdd/SKILL.md\` and workflow skills (specx-propose, specx-spec, specx-build, …). Spec-driven: agree in specs before code.\n`,
    "utf8"
  );
  written.push(copilotPath);

  return written;
}
