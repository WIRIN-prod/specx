import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { getRoots } from "../lib/paths.js";
import { listFeatureIds } from "../lib/features.js";
import { loadFeaturesCatalog } from "../lib/features-catalog.js";
import { loadRegistry, setActiveFeature, saveRegistry } from "../lib/registry.js";
import { formatDependencyGraph } from "../lib/feature-deps.js";
import { validateFeaturePath } from "../lib/feature-paths.js";
import { ensureCatalogEntry } from "../lib/features-catalog.js";
import { formatFeatureTree } from "../lib/feature-paths.js";

export function runFeatureList(): void {
  const { specxDir } = getRoots();
  const catalog = loadFeaturesCatalog();
  const registry = loadRegistry();
  const active = registry.features?.active;
  const disk = listFeatureIds(specxDir);

  console.log(chalk.bold("\nFeatures (segmented paths)"));
  console.log(chalk.dim("  See specx/STRUCTURE.md — leaf folder = feature\n"));

  const all = new Set([...disk, ...Object.keys(catalog.features)]);
  if (all.size === 0) {
    console.log(chalk.dim("  None. Example: specx propose auth/email/registration"));
    return;
  }

  const treeLines = formatFeatureTree([...all].sort(), active);
  if (treeLines.length) {
    for (const line of treeLines) console.log(`  ${line}`);
  }

  console.log(chalk.bold("\nRegistry"));
  for (const id of [...all].sort()) {
    const entry = catalog.features[id];
    const item = registry.features?.items?.[id];
    const mark = id === active ? chalk.cyan("▸ ") : "  ";
    const status = item?.status ?? chalk.dim("—");
    console.log(`${mark}${chalk.bold(id)} ${status}`);
    if (entry?.depends_on?.length) {
      console.log(chalk.dim(`      depends_on: ${entry.depends_on.join(", ")}`));
    }
  }
}

export function runFeatureUse(id: string): void {
  const path = validateFeaturePath(id);
  ensureCatalogEntry(path);
  saveRegistry(setActiveFeature(loadRegistry(), path));
  console.log(chalk.green(`Active feature: ${path}`));
}

export function runFeatureGraph(): void {
  console.log("\n" + formatDependencyGraph());
}

export function runFeatureStructure(): void {
  const { specxDir } = getRoots();
  const p = path.join(specxDir, "STRUCTURE.md");
  if (!fs.existsSync(p)) {
    console.log(chalk.yellow("STRUCTURE.md not found. Run specx init or specx update."));
    return;
  }
  console.log(fs.readFileSync(p, "utf8"));
}
