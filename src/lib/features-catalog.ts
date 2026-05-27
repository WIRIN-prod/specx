import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import {
  FeaturesCatalogSchema,
  FeaturePathSchema,
  defaultFeaturesCatalog,
  type FeaturesCatalog,
} from "../../schemas/features-catalog.js";
import { validateFeaturePath } from "./feature-paths.js";
import { getRoots } from "./paths.js";

export function featuresCatalogPath(projectRoot?: string): string {
  const { specxDir } = getRoots(projectRoot);
  return path.join(specxDir, "features.yaml");
}

export function loadFeaturesCatalog(projectRoot?: string): FeaturesCatalog {
  const p = featuresCatalogPath(projectRoot);
  if (!fs.existsSync(p)) {
    const cat = defaultFeaturesCatalog();
    saveFeaturesCatalog(cat, projectRoot);
    return cat;
  }
  return FeaturesCatalogSchema.parse(parseYaml(fs.readFileSync(p, "utf8")));
}

export function saveFeaturesCatalog(
  catalog: FeaturesCatalog,
  projectRoot?: string
): void {
  const p = featuresCatalogPath(projectRoot);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, stringifyYaml(catalog), "utf8");
}

export function validateFeatureId(id: string): string {
  return validateFeaturePath(id);
}

export function ensureCatalogEntry(
  featurePath: string,
  opts?: { title?: string; description?: string }
): FeaturesCatalog {
  const id = validateFeaturePath(featurePath);
  const catalog = loadFeaturesCatalog();
  const existing = catalog.features[id];
  catalog.features[id] = {
    depends_on: existing?.depends_on ?? [],
    title: opts?.title ?? existing?.title ?? id.split("/").pop() ?? id,
    path: id,
    description: opts?.description ?? existing?.description,
    ...existing,
    ...opts,
  };
  saveFeaturesCatalog(catalog);
  return catalog;
}

export function listCatalogFeatureIds(): string[] {
  return Object.keys(loadFeaturesCatalog().features).sort();
}
