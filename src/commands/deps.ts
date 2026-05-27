import chalk from "chalk";
import {
  addDependency,
  removeDependency,
  formatDependencyGraph,
} from "../lib/feature-deps.js";
import { validateFeatureId } from "../lib/features-catalog.js";
import { ensureCatalogEntry } from "../lib/features-catalog.js";

export function runDepAdd(from: string, to: string): void {
  validateFeatureId(from);
  validateFeatureId(to);
  ensureCatalogEntry(from);
  ensureCatalogEntry(to);
  addDependency(from, to);
  console.log(chalk.green(`Dependency: ${from} → depends on → ${to}`));
  console.log(chalk.dim("(M→M: other features may also depend on the same target)"));
}

export function runDepRemove(from: string, to: string): void {
  removeDependency(from, to);
  console.log(chalk.yellow(`Removed: ${from} no longer depends on ${to}`));
}

export function runDepList(): void {
  console.log("\n" + formatDependencyGraph());
}
