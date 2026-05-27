import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { getRoots } from "./paths.js";
import { loadRegistry, getActiveFeature } from "./registry.js";
import {
  validateFeaturePath,
  featureDirFromPath,
  discoverFeaturePaths,
  ensureParentSegments,
  splitFeaturePath,
  templateDir,
} from "./feature-paths.js";

export type FeatureArtifact = "feature" | "spec" | "design" | "tasks";

export const FEATURE_ARTIFACT_FILES: Record<FeatureArtifact, string> = {
  feature: "FEATURE.md",
  spec: "spec.md",
  design: "design.md",
  tasks: "tasks.md",
};

export const ARTIFACT_ALIASES: Record<string, FeatureArtifact> = {
  proposal: "feature",
  feature: "feature",
  spec: "spec",
  design: "design",
  tasks: "tasks",
};

export function getFeatureDir(specxDir: string, featurePath: string): string {
  const normalized = validateFeaturePath(featurePath);
  const primary = featureDirFromPath(specxDir, normalized);
  if (fs.existsSync(primary)) return primary;
  const legacyBucket = path.join(specxDir, "features", ...normalized.split("/"));
  if (fs.existsSync(legacyBucket)) return legacyBucket;
  const legacyChange = path.join(specxDir, "changes", normalized);
  if (fs.existsSync(legacyChange)) return legacyChange;
  return primary;
}

export function listFeatureIds(specxDir: string): string[] {
  return discoverFeaturePaths(specxDir);
}

export function resolveFeature(name?: string, projectRoot?: string): string {
  const registry = loadRegistry(projectRoot);
  const feature = name ?? getActiveFeature(registry);
  if (!feature) {
    console.error(
      chalk.red(
        "No active feature. Use: specx propose auth/email/registration"
      )
    );
    process.exit(1);
  }
  return validateFeaturePath(feature);
}

export function artifactPath(
  featurePath: string,
  artifact: FeatureArtifact,
  projectRoot?: string
): string {
  const { specxDir } = getRoots(projectRoot);
  return path.join(
    getFeatureDir(specxDir, featurePath),
    FEATURE_ARTIFACT_FILES[artifact]
  );
}

export function featureBriefPath(
  featurePath: string,
  projectRoot?: string
): string | null {
  const featureMd = artifactPath(featurePath, "feature", projectRoot);
  if (fs.existsSync(featureMd)) return featureMd;
  const { specxDir } = getRoots(projectRoot);
  const legacy = path.join(
    getFeatureDir(specxDir, featurePath),
    "proposal.md"
  );
  return fs.existsSync(legacy) ? legacy : null;
}

export function parseArtifactArg(arg: string): FeatureArtifact {
  const a = ARTIFACT_ALIASES[arg];
  if (!a) {
    throw new Error(
      `Unknown artifact "${arg}". Use: feature | spec | design | tasks`
    );
  }
  return a;
}

export function scaffoldFeatureTree(
  specxDir: string,
  featurePath: string
): string {
  ensureParentSegments(specxDir, featurePath);
  return featureDirFromPath(specxDir, featurePath);
}

export {
  validateFeaturePath,
  discoverFeaturePaths,
  splitFeaturePath,
  templateDir,
};
