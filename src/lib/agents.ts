import fs from "node:fs";
import path from "node:path";
import { getRoots } from "./paths.js";

const COMMANDS = [
  { slash: "/specx:discover", cli: "specx discover", desc: "Start or show discovery status" },
  { slash: "/specx:discover quick", cli: "specx discover quick", desc: "Quick track (phases 07-09)" },
  { slash: "/specx:phase", cli: "specx phase <n>", desc: "Scaffold discovery phase output" },
  { slash: "/specx:approve", cli: "specx approve", desc: "Approve current discovery phase" },
  { slash: "/specx:revise", cli: "specx revise", desc: "Request revision on current phase" },
  { slash: "/specx:propose", cli: "specx propose <name>", desc: "Start a new change" },
  { slash: "/specx:spec", cli: "specx spec [change]", desc: "Generate spec from proposal" },
  { slash: "/specx:design", cli: "specx design [change]", desc: "Generate design from spec" },
  { slash: "/specx:tasks", cli: "specx tasks [change]", desc: "Generate tasks from design" },
  { slash: "/specx:build", cli: "specx build [change]", desc: "Execute tasks with fresh context" },
  { slash: "/specx:verify", cli: "specx verify [change]", desc: "Verify implementation vs spec" },
  { slash: "/specx:archive", cli: "specx archive <change>", desc: "Merge deltas and archive" },
  { slash: "/specx:status", cli: "specx status", desc: "Show registry state" },
  { slash: "/specx:diff", cli: "specx diff [change]", desc: "Show pending spec deltas" },
  { slash: "/specx:drift", cli: "specx drift", desc: "Detect spec/code drift" },
  { slash: "/specx:health", cli: "specx health", desc: "Spec health report" },
  { slash: "/specx:onboard", cli: "specx onboard", desc: "Project context for agents" },
  { slash: "/specx:changelog", cli: "specx changelog", desc: "Regenerate changelog" },
  { slash: "/specx:review", cli: "specx review <change>", desc: "Flag change for review (enterprise)" },
];

export function generateAgentIntegrations(projectRoot?: string): string[] {
  const { projectRoot: root } = getRoots(projectRoot);
  const written: string[] = [];

  const cursorDir = path.join(root, ".cursor", "rules");
  fs.mkdirSync(cursorDir, { recursive: true });

  const cmdLines = COMMANDS.map(
    (c) => `- **${c.slash}** → \`${c.cli}\` — ${c.desc}`
  ).join("\n");

  const ruleContent = `---
description: specX slash commands and agent workflow
globs:
alwaysApply: true
---

# specX Agent Instructions

Read \`specx/SPECX.md\` first, then \`specx/foundation/STEERING.md\` if it exists.

## Slash commands

${cmdLines}

## Session bootstrap

1. Read specx/SPECX.md
2. Read .specx/registry.yaml for active phase/change
3. Read specx/foundation/STEERING.md when present
4. Never skip human approval gates
5. Never archive without explicit user approval

## Dual-agent (Discovery + Build specs)

- **Specialist**: produce the artifact
- **Critic**: challenge assumptions, contradictions, gaps
- Human sees both before approve/revise
`;

  const rulePath = path.join(cursorDir, "specx.mdc");
  fs.writeFileSync(rulePath, ruleContent, "utf8");
  written.push(rulePath);

  const copilotPath = path.join(root, ".github", "copilot-instructions.md");
  if (!fs.existsSync(copilotPath)) {
    fs.mkdirSync(path.dirname(copilotPath), { recursive: true });
    fs.writeFileSync(
      copilotPath,
      `# Copilot instructions\n\nSee specx/SPECX.md and .cursor/rules/specx.mdc for specX workflow.\n`,
      "utf8"
    );
    written.push(copilotPath);
  }

  return written;
}

export { COMMANDS };
