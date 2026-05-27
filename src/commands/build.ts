import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { loadConfig } from "../lib/config.js";
import {
  loadRegistry,
  saveRegistry,
  setActiveFeature,
  patchFeatureItem,
} from "../lib/registry.js";
import { getRoots } from "../lib/paths.js";
import { formatDiffSummary } from "../lib/delta.js";
import { defaultVars, copyTemplateTree } from "../lib/template.js";
import { formatBuildTasksSection, parseTasksMarkdown } from "../lib/tasks.js";
import {
  resolveFeature,
  getFeatureDir,
  artifactPath,
  featureBriefPath,
  FEATURE_ARTIFACT_FILES,
} from "../lib/features.js";
import { ensureCatalogEntry } from "../lib/features-catalog.js";
import {
  validateFeaturePath,
  scaffoldFeatureTree,
  templateDir,
} from "../lib/features.js";
import { getDependencies, validateDependenciesExist } from "../lib/feature-deps.js";
import {
  analyzeFeatureImpact,
  formatDiscoveryImpactReport,
} from "../lib/discovery-impact.js";

export function runPropose(name: string, message?: string): void {
  const id = validateFeaturePath(name);
  const { specxDir, projectRoot } = getRoots();
  const featureDir = scaffoldFeatureTree(specxDir, id);
  const exists = fs.existsSync(path.join(featureDir, "FEATURE.md")) ||
    fs.existsSync(path.join(featureDir, "spec.md"));

  const vars = defaultVars(
    loadConfig().project?.name ?? path.basename(projectRoot),
    loadConfig().track,
    id
  );

  if (!exists) {
    const tpl = templateDir(specxDir);
    if (fs.existsSync(tpl)) {
      copyTemplateTree(tpl, featureDir, vars);
    } else {
      fs.mkdirSync(featureDir, { recursive: true });
      fs.mkdirSync(path.join(featureDir, "specs"), { recursive: true });
      fs.writeFileSync(
        path.join(featureDir, "FEATURE.md"),
        `# Feature: ${id}\n\n## Why\n\n${message ?? "TBD"}\n`,
        "utf8"
      );
      for (const [key, file] of Object.entries(FEATURE_ARTIFACT_FILES)) {
        if (key === "feature") continue;
        fs.writeFileSync(
          path.join(featureDir, file),
          `# ${key}: ${id}\n\n`,
          "utf8"
        );
      }
    }
    if (message) {
      const brief = path.join(featureDir, "FEATURE.md");
      fs.writeFileSync(
        brief,
        `# Feature: ${id}\n\n## Why\n\n${message}\n\n## In scope\n\n- \n\n## Out of scope\n\n- \n`,
        "utf8"
      );
    }
  } else if (message) {
    console.log(
      chalk.yellow(
        `Feature ${id} exists — update FEATURE.md in place (no new folder).`
      )
    );
  }

  ensureCatalogEntry(id, { title: id });

  const registry = loadRegistry();
  const existing = registry.features?.items?.[id];
  let reg = setActiveFeature(registry, id);
  reg = {
    ...reg,
    features: {
      ...reg.features,
      items: {
        ...reg.features?.items,
        [id]: {
          ...existing,
          status: existing?.status ?? "proposed",
          created_at: existing?.created_at ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    },
  };
  saveRegistry(reg);

  const missingDeps = validateDependenciesExist(id);
  if (missingDeps.length) {
    console.log(
      chalk.yellow(
        `Warning: depends_on references missing catalog entries: ${missingDeps.join(", ")}`
      )
    );
  }

  const deps = getDependencies(id);
  if (deps.length) {
    console.log(chalk.dim(`Depends on: ${deps.join(", ")}`));
  }

  console.log(
    exists
      ? chalk.green(`Active feature: ${id}`)
      : chalk.green(`Created feature: ${id}`)
  );
  console.log(`  ${featureDir}`);
  console.log(chalk.cyan("Next: specx spec"));
  console.log(chalk.dim("\nDiscovery golden truth — review required phases:"));
  const impacts = analyzeFeatureImpact(id, loadConfig().track);
  const required = impacts.filter((i) => i.priority === "required");
  for (const i of required) {
    console.log(chalk.yellow(`  • Phase ${String(i.phase).padStart(2, "0")}: ${i.reason}`));
  }
  console.log(chalk.dim(`  Full checklist: specx discover impact ${id}`));
}

export function runSpec(featureName?: string): void {
  const id = resolveFeature(featureName);
  const specPath = artifactPath(id, "spec");
  if (!fs.existsSync(specPath)) {
    fs.writeFileSync(
      specPath,
      `# Spec: ${id}\n\n## ADDED Requirements\n\n### Requirement: TBD\n`,
      "utf8"
    );
  }
  updateFeatureStatus(id, "spec");
  console.log(chalk.green(`Spec ready: ${specPath}`));
}

export function runDesign(featureName?: string): void {
  const id = resolveFeature(featureName);
  const designPath = artifactPath(id, "design");
  if (!fs.existsSync(designPath)) {
    fs.writeFileSync(designPath, `# Design: ${id}\n\n## Approach\n\n`, "utf8");
  }
  updateFeatureStatus(id, "design");
  console.log(chalk.green(`Design ready: ${designPath}`));
}

export function runTasks(featureName?: string): void {
  const id = resolveFeature(featureName);
  const tasksPath = artifactPath(id, "tasks");
  if (!fs.existsSync(tasksPath)) {
    fs.writeFileSync(tasksPath, `# Tasks: ${id}\n\n- [ ] 1.1 TBD\n`, "utf8");
  }
  updateFeatureStatus(id, "tasks");
  console.log(chalk.green(`Tasks ready: ${tasksPath}`));
}

export function runBuild(
  featureName?: string,
  options?: { task?: string; one?: boolean }
): void {
  const id = resolveFeature(featureName);
  const { specxDir } = getRoots();
  const featureDir = getFeatureDir(specxDir, id);
  const tasksPath = artifactPath(id, "tasks");
  const specPath = artifactPath(id, "spec");
  const designPath = artifactPath(id, "design");

  updateFeatureStatus(id, "building");

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

  const deps = getDependencies(id);
  const depSection =
    deps.length > 0
      ? `Upstream features (read specs first): ${deps.map((d) => `specx/${d}/`).join(", ")}`
      : "";

  const instruction = singleTask
    ? "Clear prior chat context. Implement only the focus task below against the spec."
    : [
        "Clear prior chat context. Implement **all** open tasks below against this feature's spec and design.",
        "Work in the codebase areas owned by this feature; respect upstream feature contracts.",
        "Update tasks.md checkboxes in place when verified.",
      ].join(" ");

  const brief = [
    `# Build brief — feature: ${id}`,
    "",
    depSection,
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
    "## FEATURE brief",
    (() => {
      const p = featureBriefPath(id);
      return p ? fs.readFileSync(p, "utf8") : "_missing FEATURE.md_";
    })(),
    "",
    "## Full tasks.md",
    fs.existsSync(tasksPath) ? fs.readFileSync(tasksPath, "utf8") : "_missing_",
    "",
    `## Feature root`,
    featureDir,
  ].join("\n");

  console.log(brief);
}

export function runVerify(featureName?: string): void {
  const id = resolveFeature(featureName);
  const specPath = artifactPath(id, "spec");

  console.log(chalk.bold(`Verifier checklist — feature ${id}`));
  const checks = [
    ["FEATURE.md", !!featureBriefPath(id)],
    ["Spec exists", fs.existsSync(specPath)],
    ["Tasks exist", fs.existsSync(artifactPath(id, "tasks"))],
    ["Design exists", fs.existsSync(artifactPath(id, "design"))],
  ];
  for (const [label, ok] of checks) {
    console.log(`  ${ok ? chalk.green("✓") : chalk.red("✗")} ${label}`);
  }

  updateFeatureStatus(id, "verifying");
  console.log(
    chalk.dim(
      "\nFeature specs are golden truth under specx/<path>/ — no archive step."
    )
  );
}

export function runArchive(featureName?: string): void {
  const id = featureName ?? resolveFeature();
  console.log(
    chalk.yellow(
      `Archive is deprecated. Feature "${id}" stays at specx/${id}/ as the source of truth.`
    )
  );
  console.log(
    chalk.dim(
      "Update spec.md / design.md / tasks.md in place. Use specx approve when gates pass."
    )
  );
  process.exit(0);
}

export function runDiff(featureName?: string): void {
  const id = resolveFeature(featureName);
  const { specxDir } = getRoots();
  console.log(formatDiffSummary(specxDir, id));
}

function updateFeatureStatus(
  id: string,
  status: "proposed" | "spec" | "design" | "tasks" | "building" | "verifying"
): void {
  const registry = loadRegistry();
  const item = registry.features?.items?.[id];
  if (!item) return;
  saveRegistry(
    patchFeatureItem(registry, id, {
      status,
      phase: status,
    })
  );
}
