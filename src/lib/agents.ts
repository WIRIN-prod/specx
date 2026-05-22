import fs from "node:fs";
import path from "node:path";
import { getRoots, resolvePackageTemplates } from "./paths.js";
import { substitute, type TemplateVars } from "./template.js";

export const COMMANDS = [
  { slash: "/specx:discover", file: "discover", desc: "Discovery layer — pre-product SDD" },
  { slash: "/specx:phase", file: "discover", desc: "Scaffold discovery phase (use with phase number)" },
  { slash: "/specx:specialist", file: "specialist", desc: "Specialist agent — produce artifact" },
  { slash: "/specx:critic", file: "critic", desc: "Critic agent — challenge artifact" },
  { slash: "/specx:approve", file: "discover", desc: "Approve phase (human gate first)" },
  { slash: "/specx:revise", file: "discover", desc: "Request phase revision" },
  { slash: "/specx:propose", file: "propose", desc: "Start change — proposal + capabilities" },
  { slash: "/specx:spec", file: "spec", desc: "Behavior specs + delta specs" },
  { slash: "/specx:design", file: "design", desc: "Technical design from spec" },
  { slash: "/specx:tasks", file: "tasks", desc: "Checkbox implementation plan" },
  { slash: "/specx:build", file: "build", desc: "Implement one task, fresh context" },
  { slash: "/specx:verify", file: "verify", desc: "Verifier pass vs spec" },
  { slash: "/specx:archive", file: "archive", desc: "Merge deltas and archive" },
  { slash: "/specx:status", file: "discover", desc: "Registry status (run CLI)" },
  { slash: "/specx:diff", file: "spec", desc: "Show pending deltas" },
  { slash: "/specx:drift", file: "discover", desc: "Spec/code drift report" },
  { slash: "/specx:health", file: "discover", desc: "Spec health report" },
  { slash: "/specx:onboard", file: "discover", desc: "Full context bundle" },
  { slash: "/specx:changelog", file: "archive", desc: "Regenerate changelog" },
  { slash: "/specx:review", file: "archive", desc: "Enterprise review gate" },
];

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

  // .specx/AGENTS.md — opencode-style project agent rules
  const agentsMd = path.join(root, ".specx", "AGENTS.md");
  writeFromTemplateFile(".specx/AGENTS.md", agentsMd, v);
  written.push(agentsMd);

  // .specx/commands/*.md — full SDD playbooks per command
  const commandsSrc = path.join(tpl, ".specx", "commands");
  const commandsDest = path.join(root, ".specx", "commands");
  copyDirRecursive(commandsSrc, commandsDest, v);
  if (fs.existsSync(commandsDest)) {
    written.push(commandsDest);
  }

  // .cursor/rules/specx.mdc
  const cursorDir = path.join(root, ".cursor", "rules");
  fs.mkdirSync(cursorDir, { recursive: true });
  const rulePath = path.join(cursorDir, "specx.mdc");
  writeFromTemplateFile(".cursor/rules/specx.mdc", rulePath, v);
  written.push(rulePath);

  // .cursor/skills/specx-*/
  const skillsSrc = path.join(tpl, ".cursor", "skills");
  const skillsDest = path.join(root, ".cursor", "skills");
  copyDirRecursive(skillsSrc, skillsDest, v);
  if (fs.existsSync(skillsDest)) {
    written.push(skillsDest);
  }

  // .cursor/commands/ — Cursor-native command files pointing to playbooks
  const cursorCommandsDir = path.join(root, ".cursor", "commands");
  fs.mkdirSync(cursorCommandsDir, { recursive: true });
  const commandFiles = fs.existsSync(commandsSrc)
    ? fs.readdirSync(commandsSrc).filter((f) => f.endsWith(".md"))
    : [];

  for (const file of commandFiles) {
    const base = file.replace(/\.md$/, "");
    const slash = `/specx:${base}`;
    const body = fs.readFileSync(path.join(commandsSrc, file), "utf8");
    const cursorCmd = `---\ndescription: specX ${base} — Spec-Driven Development\n---\n\nWhen the user runs **${slash}**, follow this playbook:\n\nRead and execute: \`.specx/commands/${file}\`\n\nAlso apply skill \`specx-sdd\` and domain skill \`specx-${base}\` if it exists.\n\n---\n\n${body}`;
    const out = path.join(cursorCommandsDir, `specx-${base}.md`);
    fs.writeFileSync(out, cursorCmd, "utf8");
    written.push(out);
  }

  // Root AGENTS.md pointer (tools that read repo root)
  const rootAgents = path.join(root, "AGENTS.md");
  if (!fs.existsSync(rootAgents)) {
    fs.writeFileSync(
      rootAgents,
      `# AGENTS.md\n\nThis project uses **specX**. Read:\n\n- [.specx/AGENTS.md](.specx/AGENTS.md) — SDD workflow\n- [specx/SPECX.md](specx/SPECX.md) — constitution\n- [.specx/commands/](.specx/commands/) — slash command playbooks\n`,
      "utf8"
    );
    written.push(rootAgents);
  }

  const copilotPath = path.join(root, ".github", "copilot-instructions.md");
  fs.mkdirSync(path.dirname(copilotPath), { recursive: true });
  fs.writeFileSync(
    copilotPath,
    `# Copilot — specX SDD\n\nFollow [.specx/AGENTS.md](.specx/AGENTS.md). Spec-driven: agree in \`specx/specs/\` before code. Slash commands map to \`.specx/commands/*.md\`.\n`,
    "utf8"
  );
  written.push(copilotPath);

  return written;
}
