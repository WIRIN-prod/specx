import chalk from "chalk";
import {
  loadFeaturesCatalog,
  saveFeaturesCatalog,
  validateFeatureId,
  listCatalogFeatureIds,
} from "./features-catalog.js";
import { listFeatureIds } from "./features.js";
import { getRoots } from "./paths.js";

export function addDependency(fromId: string, toId: string): void {
  const from = validateFeatureId(fromId);
  const to = validateFeatureId(toId);
  if (from === to) {
    throw new Error("A feature cannot depend on itself");
  }

  const catalog = loadFeaturesCatalog();
  if (!catalog.features[from]) {
    catalog.features[from] = { depends_on: [], title: from };
  }
  if (!catalog.features[to]) {
    catalog.features[to] = { depends_on: [], title: to };
  }

  const deps = new Set(catalog.features[from].depends_on ?? []);
  deps.add(to);
  catalog.features[from] = {
    ...catalog.features[from],
    depends_on: [...deps].sort(),
  };
  saveFeaturesCatalog(catalog);
}

export function removeDependency(fromId: string, toId: string): void {
  const from = validateFeatureId(fromId);
  const to = validateFeatureId(toId);
  const catalog = loadFeaturesCatalog();
  const entry = catalog.features[from];
  if (!entry?.depends_on?.length) return;
  catalog.features[from] = {
    ...entry,
    depends_on: entry.depends_on.filter((d) => d !== to),
  };
  saveFeaturesCatalog(catalog);
}

/** Reverse index: who depends on this feature */
export function getDependents(featureId: string): string[] {
  const catalog = loadFeaturesCatalog();
  const out: string[] = [];
  for (const [id, entry] of Object.entries(catalog.features)) {
    if (entry.depends_on?.includes(featureId)) out.push(id);
  }
  return out.sort();
}

export function getDependencies(featureId: string): string[] {
  const catalog = loadFeaturesCatalog();
  return [...(catalog.features[featureId]?.depends_on ?? [])].sort();
}

export function formatDependencyGraph(): string {
  const { specxDir } = getRoots();
  const catalog = loadFeaturesCatalog();
  const diskIds = new Set(listFeatureIds(specxDir));
  const catalogIds = listCatalogFeatureIds();
  const allIds = new Set([...diskIds, ...catalogIds]);

  const lines: string[] = [chalk.bold("Feature dependencies (M→M via depends_on):"), ""];

  if (allIds.size === 0) {
    lines.push(chalk.dim("  No features yet. Run: specx propose <feature-id>"));
    return lines.join("\n");
  }

  for (const id of [...allIds].sort()) {
    const entry = catalog.features[id];
    const deps = entry?.depends_on ?? [];
    const dependents = getDependents(id);
    const title = entry?.title ?? id;
    const onDisk = diskIds.has(id) ? chalk.green("●") : chalk.dim("○");
    lines.push(`${onDisk} ${chalk.cyan(id)} — ${title}`);
    if (deps.length) {
      lines.push(`    depends on: ${deps.join(", ")}`);
    }
    if (dependents.length) {
      lines.push(`    required by: ${dependents.join(", ")}`);
    }
    if (!deps.length && !dependents.length) {
      lines.push(chalk.dim("    (no dependencies)"));
    }
  }

  return lines.join("\n");
}

export function validateDependenciesExist(featureId: string): string[] {
  const missing: string[] = [];
  for (const dep of getDependencies(featureId)) {
    if (!loadFeaturesCatalog().features[dep]) {
      missing.push(dep);
    }
  }
  return missing;
}
