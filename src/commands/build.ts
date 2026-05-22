import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { loadConfig } from "../lib/config.js";
import {
  loadRegistry,
  saveRegistry,
  getActiveChange,
  setActiveChange,
} from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { formatDiffSummary } from "../lib/delta.js";
import { archiveChange } from "../lib/archive.js";
import { appendAudit } from "../lib/audit.js";
import { printGitHint } from "../lib/git.js";
import { writeFromTemplate, defaultVars } from "../lib/template.js";
import { formatBuildTasksSection, parseTasksMarkdown } from "../lib/tasks.js";

function resolveChange(name?: string): string {
  const registry = loadRegistry();
  const change = name ?? getActiveChange(registry);
  if (!change) {
    console.error(chalk.red("No active change. Use: specx propose <name>"));
    process.exit(1);
  }
  return change;
}

export function runPropose(name: string, message?: string): void {
  const { specxDir, projectRoot } = getRoots();
  const changeDir = path.join(specxDir, "changes", name);

  if (fs.existsSync(changeDir)) {
    console.error(chalk.red(`Change already exists: ${name}`));
    process.exit(1);
  }

  const templateDir = path.join(specxDir, "changes", "_template");
  const vars = defaultVars(
    loadConfig().project?.name ?? path.basename(projectRoot),
    loadConfig().track
  );

  if (fs.existsSync(templateDir)) {
    fs.cpSync(templateDir, changeDir, { recursive: true });
    const proposalPath = path.join(changeDir, "proposal.md");
    if (message) {
      fs.writeFileSync(
        proposalPath,
        `# Proposal: ${name}\n\n${message}\n`,
        "utf8"
      );
    }
  } else {
    fs.mkdirSync(changeDir, { recursive: true });
    fs.mkdirSync(path.join(changeDir, "specs"), { recursive: true });
    fs.writeFileSync(
      path.join(changeDir, "proposal.md"),
      `# Proposal: ${name}\n\n## Why\n\n${message ?? "TBD"}\n\n## Scope\n\n## Out of scope\n`,
      "utf8"
    );
    fs.writeFileSync(
      path.join(changeDir, "spec.md"),
      `# Spec: ${name}\n\n## ADDED Requirements\n\n### Requirement: TBD\n\n#### Scenario: TBD\n\n- GIVEN\n- WHEN\n- THEN\n`,
      "utf8"
    );
    fs.writeFileSync(
      path.join(changeDir, "design.md"),
      `# Design: ${name}\n\n## Approach\n\n`,
      "utf8"
    );
    fs.writeFileSync(
      path.join(changeDir, "tasks.md"),
      `# Tasks: ${name}\n\n- [ ] 1.1 TBD\n`,
      "utf8"
    );
  }

  let registry = setActiveChange(loadRegistry(), name);
  registry = {
    ...registry,
    changes: {
      ...registry.changes,
      active: name,
      items: {
        ...registry.changes?.items,
        [name]: {
          status: "proposed",
          created_at: new Date().toISOString(),
        },
      },
    },
  };
  saveRegistry(registry);

  console.log(chalk.green(`Created change: ${name}`));
  console.log(`  ${changeDir}`);
  console.log(chalk.cyan("Next: specx spec"));
}

export function runSpec(changeName?: string): void {
  const name = resolveChange(changeName);
  const { specxDir } = getRoots();
  const changeDir = path.join(specxDir, "changes", name);
  const specPath = path.join(changeDir, "spec.md");

  if (!fs.existsSync(specPath)) {
    fs.writeFileSync(
      specPath,
      `# Spec: ${name}\n\n## ADDED Requirements\n\n### Requirement: TBD\n`,
      "utf8"
    );
  }

  updateChangeStatus(name, "spec");
  console.log(chalk.green(`Spec ready: ${specPath}`));
}

export function runDesign(changeName?: string): void {
  const name = resolveChange(changeName);
  const { specxDir } = getRoots();
  const designPath = path.join(specxDir, "changes", name, "design.md");
  if (!fs.existsSync(designPath)) {
    fs.writeFileSync(designPath, `# Design: ${name}\n\n## Approach\n\n`, "utf8");
  }
  updateChangeStatus(name, "design");
  console.log(chalk.green(`Design ready: ${designPath}`));
}

export function runTasks(changeName?: string): void {
  const name = resolveChange(changeName);
  const { specxDir } = getRoots();
  const tasksPath = path.join(specxDir, "changes", name, "tasks.md");
  if (!fs.existsSync(tasksPath)) {
    fs.writeFileSync(tasksPath, `# Tasks: ${name}\n\n- [ ] 1.1 TBD\n`, "utf8");
  }
  updateChangeStatus(name, "tasks");
  console.log(chalk.green(`Tasks ready: ${tasksPath}`));
}

export function runBuild(
  changeName?: string,
  options?: { task?: string; one?: boolean }
): void {
  const name = resolveChange(changeName);
  const { specxDir } = getRoots();
  const tasksPath = path.join(specxDir, "changes", name, "tasks.md");
  const specPath = path.join(specxDir, "changes", name, "spec.md");
  const designPath = path.join(specxDir, "changes", name, "design.md");

  updateChangeStatus(name, "building");

  const progress = fs.existsSync(tasksPath)
    ? parseTasksMarkdown(fs.readFileSync(tasksPath, "utf8"))
    : null;

  if (options?.one && !options?.task) {
    console.error(
      chalk.red("Use --task X.Y with --one, or omit both to build all open tasks.")
    );
    process.exit(1);
  }
  const singleTask = !!options?.task;
  const mode = singleTask ? "single" : "all";
  const taskSection = progress
    ? formatBuildTasksSection(progress, mode, options?.task)
    : "_missing tasks.md — run specx tasks_";

  const instruction = singleTask
    ? "Clear prior chat context. Implement only the focus task below against the spec."
    : [
        "Clear prior chat context. Implement **all** open tasks below against the spec and design.",
        "Work through the list in order; mark each checkbox in tasks.md when verified.",
        "Use `specx build --one` or `specx build --task X.Y` only when the user wants a single task.",
      ].join(" ");

  const brief = [
    `# Build brief — ${name}`,
    "",
    "## Instruction",
    instruction,
    "",
    taskSection,
    "",
    "## Spec",
    fs.existsSync(specPath) ? fs.readFileSync(specPath, "utf8") : "_missing_",
    "",
    "## Design",
    fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : "_missing_",
    "",
    "## Full tasks.md",
    fs.existsSync(tasksPath) ? fs.readFileSync(tasksPath, "utf8") : "_missing_",
  ].join("\n");

  console.log(brief);
}

export function runVerify(changeName?: string): void {
  const name = resolveChange(changeName);
  const { specxDir } = getRoots();
  const specPath = path.join(specxDir, "changes", name, "spec.md");

  console.log(chalk.bold(`Verifier checklist — ${name}`));
  const checks = [
    ["Spec exists", fs.existsSync(specPath)],
    ["Tasks exist", fs.existsSync(path.join(specxDir, "changes", name, "tasks.md"))],
    ["Design exists", fs.existsSync(path.join(specxDir, "changes", name, "design.md"))],
  ];
  for (const [label, ok] of checks) {
    console.log(`  ${ok ? chalk.green("✓") : chalk.red("✗")} ${label}`);
  }

  updateChangeStatus(name, "verifying");
  console.log(chalk.dim("\nManually verify implementation matches spec scenarios."));
}

export function runArchive(changeName?: string): void {
  const name = resolveChange(changeName);
  const config = loadConfig();
  const registry = loadRegistry();
  const item = registry.changes?.items?.[name];

  if (config.gates?.build?.review_before_archive && item?.review_required) {
    console.error(
      chalk.red("Review required before archive. Run: specx review " + name)
    );
    process.exit(1);
  }

  const { archivePath, updatedSpecs } = archiveChange(name);
  appendAudit("build.archive", { change: name, archivePath });

  let reg = loadRegistry();
  const items = { ...reg.changes?.items };
  if (items[name]) {
    items[name] = { ...items[name], status: "archived" };
  }
  reg = setActiveChange(
    { ...reg, changes: { ...reg.changes, items } },
    null
  );
  saveRegistry(reg);

  console.log(chalk.green(`Archived: ${archivePath}`));
  if (updatedSpecs.length) {
    console.log(chalk.dim("Updated specs:"));
    for (const s of updatedSpecs) console.log(`  ${s}`);
  }
  printGitHint(updatedSpecs);
}

export function runDiff(changeName?: string): void {
  const name = resolveChange(changeName);
  const { specxDir } = getRoots();
  console.log(formatDiffSummary(specxDir, name));
}

function updateChangeStatus(
  name: string,
  status: "proposed" | "spec" | "design" | "tasks" | "building" | "verifying"
): void {
  const registry = loadRegistry();
  const item = registry.changes?.items?.[name];
  if (!item) return;
  saveRegistry({
    ...registry,
    changes: {
      ...registry.changes,
      items: {
        ...registry.changes?.items,
        [name]: { ...item, status },
      },
    },
  });
}
