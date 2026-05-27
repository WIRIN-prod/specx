import fs from "node:fs";
import path from "node:path";
import { isFeatureTreeRootDir } from "./specx-layout.js";

/** One folder name in the spec tree (under specx/, not under specx/features/) */
export type SegmentKind =
  | "route"
  | "group"
  | "dynamic"
  | "private";

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const GROUP = /^\([a-z][a-z0-9]*(-[a-z0-9]+)*\)$/;
const DYNAMIC =
  /^\[[a-z][a-z0-9]*(-[a-z0-9]+)*\]$|^\[\.\.\.[a-z][a-z0-9]*(-[a-z0-9]+)*\]$|^\[\[\.\.\.[a-z][a-z0-9]*(-[a-z0-9]+)*\]\]$/;

export function classifySegment(name: string): SegmentKind {
  if (name.startsWith("_")) return "private";
  if (GROUP.test(name)) return "group";
  if (DYNAMIC.test(name)) return "dynamic";
  if (KEBAB.test(name)) return "route";
  throw new Error(
    `Invalid segment "${name}". Use kebab-case, (group), [param], or _private.`
  );
}

export function normalizeFeaturePath(input: string): string {
  const raw = input
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");
  if (!raw) throw new Error("Feature path is required");
  const segments = raw.split("/").filter(Boolean);
  if (segments.some((s) => s === "." || s === "..")) {
    throw new Error("Feature path cannot contain . or ..");
  }
  const normalized = segments.map((seg) => {
    classifySegment(seg);
    if (seg.startsWith("_")) {
      throw new Error(`Cannot propose a feature under private segment ${seg}`);
    }
    return seg;
  });
  return normalized.join("/");
}

export function validateFeaturePath(featurePath: string): string {
  return normalizeFeaturePath(featurePath);
}

export function splitFeaturePath(featurePath: string): string[] {
  return normalizeFeaturePath(featurePath).split("/");
}

/** Canonical on-disk path: specx/auth/email/registration (leaf = feature) */
export function featureDirFromPath(specxDir: string, featurePath: string): string {
  const segments = splitFeaturePath(featurePath);
  return path.join(specxDir, ...segments);
}

export function isFeatureLeafDir(dir: string): boolean {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return false;
  return (
    fs.existsSync(path.join(dir, "FEATURE.md")) ||
    fs.existsSync(path.join(dir, "proposal.md")) ||
    fs.existsSync(path.join(dir, "spec.md"))
  );
}

function walkFeatureTree(
  currentDir: string,
  segments: string[],
  found: string[]
): void {
  if (!fs.existsSync(currentDir)) return;
  if (isFeatureLeafDir(currentDir) && segments.length > 0) {
    found.push(segments.join("/"));
  }
  for (const name of fs.readdirSync(currentDir)) {
    if (name === "SEGMENT.md" || name === "STRUCTURE.md") continue;
    if (name.startsWith(".")) continue;
    const child = path.join(currentDir, name);
    if (!fs.statSync(child).isDirectory()) continue;
    if (segments.length === 0 && !isFeatureTreeRootDir(name)) continue;
    if (classifySegment(name) === "private") continue;
    walkFeatureTree(child, [...segments, name], found);
  }
}

/** Discover leaf paths: specx/auth/.../leaf and legacy specx/features/... */
export function discoverFeaturePaths(specxDir: string): string[] {
  const found: string[] = [];

  for (const name of fs.readdirSync(specxDir)) {
    if (!isFeatureTreeRootDir(name)) continue;
    walkFeatureTree(path.join(specxDir, name), [name], found);
  }

  const legacyFeatures = path.join(specxDir, "features");
  if (fs.existsSync(legacyFeatures)) {
    for (const name of fs.readdirSync(legacyFeatures)) {
      if (name.startsWith("_") || name.startsWith(".")) continue;
      if (name === "STRUCTURE.md") continue;
      const child = path.join(legacyFeatures, name);
      if (!fs.statSync(child).isDirectory()) continue;
      walkFeatureTree(child, [name], found);
    }
  }

  return [...new Set(found)].sort();
}

export function formatFeatureTree(
  paths: string[],
  active?: string | null
): string[] {
  const lines: string[] = [];
  for (const p of [...paths].sort()) {
    const depth = p.split("/").length - 1;
    const indent = "  ".repeat(depth);
    const mark = p === active ? " ▸" : "";
    lines.push(`${indent}${p}${mark}`);
  }
  return lines;
}

/** Segment folders only — leaf is created by propose with FEATURE.md */
export function ensureParentSegments(specxDir: string, featurePath: string): void {
  const segments = splitFeaturePath(featurePath);
  let current = specxDir;
  for (let i = 0; i < segments.length - 1; i++) {
    current = path.join(current, segments[i]!);
    fs.mkdirSync(current, { recursive: true });
    const readme = path.join(current, "SEGMENT.md");
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(
        readme,
        `# Segment: ${segments.slice(0, i + 1).join("/")}\n\nOrganizational folder — not a feature. A **feature** is the **leaf** folder that contains \`FEATURE.md\`, \`spec.md\`, \`design.md\`, and \`tasks.md\`.\n`,
        "utf8"
      );
    }
  }
}

export function templateDir(specxDir: string): string {
  return path.join(specxDir, "_template");
}
