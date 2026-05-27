import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import {
  RegistrySchema,
  defaultRegistry,
  normalizeRegistryRaw,
  type Registry,
} from "../../schemas/registry.js";
import { getPhasesForTrack, loadConfig } from "./config.js";
import { getRoots } from "./paths.js";

export function loadRegistry(projectRoot?: string): Registry {
  const { dotSpecxDir } = getRoots(projectRoot);
  const registryPath = path.join(dotSpecxDir, "registry.yaml");
  if (!fs.existsSync(registryPath)) {
    const config = loadConfig(projectRoot);
    const reg = defaultRegistry(getPhasesForTrack(config.track));
    saveRegistry(reg, projectRoot);
    return reg;
  }
  const raw = parseYaml(fs.readFileSync(registryPath, "utf8"));
  const { value, changed } = normalizeRegistryRaw(raw);
  const parsed = RegistrySchema.parse(value);
  if (changed) saveRegistry(parsed, projectRoot);
  return parsed;
}

export function saveRegistry(
  registry: Registry,
  projectRoot?: string
): void {
  const { dotSpecxDir } = getRoots(projectRoot);
  const registryPath = path.join(dotSpecxDir, "registry.yaml");
  fs.mkdirSync(dotSpecxDir, { recursive: true });
  fs.writeFileSync(registryPath, stringifyYaml(registry), "utf8");
}

export function phaseKey(n: number): string {
  return String(n).padStart(2, "0");
}

export function getActiveFeature(registry: Registry): string | null {
  return registry.features?.active ?? registry.changes?.active ?? null;
}

/** @deprecated Use getActiveFeature */
export const getActiveChange = getActiveFeature;

export function setActiveFeature(
  registry: Registry,
  name: string | null
): Registry {
  return {
    ...registry,
    features: {
      ...registry.features,
      active: name,
      items: registry.features?.items ?? {},
    },
  };
}

/** @deprecated Use setActiveFeature */
export const setActiveChange = setActiveFeature;

export function patchFeatureItem(
  registry: Registry,
  featureId: string,
  patch: Record<string, unknown>
): Registry {
  const item = registry.features?.items?.[featureId];
  if (!item) {
    throw new Error(`Unknown feature in registry: ${featureId}`);
  }
  return {
    ...registry,
    features: {
      ...registry.features,
      items: {
        ...registry.features?.items,
        [featureId]: { ...item, ...patch, updated_at: new Date().toISOString() },
      },
    },
  };
}
