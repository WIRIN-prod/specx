/** Top-level folders under specx/ that are NOT part of the feature tree */
export const SPECX_RESERVED_DIRS = new Set([
  "discovery",
  "foundation",
  "evolution",
  "specs",
  "changes",
  "features", // legacy — contents still scanned for migration
]);

export const SPECX_RESERVED_FILES = new Set([
  "SPECX.md",
  "STRUCTURE.md",
  "features.yaml",
]);

export function isFeatureTreeRootDir(name: string): boolean {
  if (name.startsWith(".") || name.startsWith("_")) return false;
  return !SPECX_RESERVED_DIRS.has(name);
}
