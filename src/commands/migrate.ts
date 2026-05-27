import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { getRoots } from "../lib/paths.js";
import { loadRegistry, saveRegistry } from "../lib/registry.js";
import {
  ensureCatalogEntry,
  loadFeaturesCatalog,
  saveFeaturesCatalog,
} from "../lib/features-catalog.js";
import { validateFeaturePath, isFeatureLeafDir } from "../lib/feature-paths.js";
import { copyFromPackageTemplates, defaultVars } from "../lib/template.js";
import { loadConfig } from "../lib/config.js";
import { resolvePackageTemplates } from "../lib/paths.js";

export interface MigrateOptions {
  dryRun?: boolean;
  map?: Record<string, string>;
  keepLegacyDirs?: boolean;
  projectRoot?: string;
}

type Action = { kind: string; detail: string };

function loadMapFile(dotSpecxDir: string): Record<string, string> {
  const p = path.join(dotSpecxDir, "migrate-map.yaml");
  if (!fs.existsSync(p)) return {};
  const raw = parseYaml(fs.readFileSync(p, "utf8")) as {
    map?: Record<string, string>;
  };
  return raw?.map ?? {};
}

export function parseMigrateMapPairs(pairs: string[] | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!pairs) return out;
  for (const pair of pairs) {
    const idx = pair.indexOf(":");
    if (idx === -1) {
      throw new Error(`Invalid --map "${pair}" — use old-name:new/path`);
    }
    const from = pair.slice(0, idx).trim();
    const to = pair.slice(idx + 1).trim();
    out[from] = validateFeaturePath(to);
  }
  return out;
}

function renameProposalToFeature(dir: string, dryRun: boolean, actions: Action[]): void {
  const proposal = path.join(dir, "proposal.md");
  const feature = path.join(dir, "FEATURE.md");
  if (!fs.existsSync(proposal) || fs.existsSync(feature)) return;
  if (dryRun) {
    actions.push({ kind: "rename", detail: `${proposal} → FEATURE.md` });
    return;
  }
  fs.renameSync(proposal, feature);
  actions.push({ kind: "rename", detail: `proposal.md → FEATURE.md in ${dir}` });
}

function moveDir(
  src: string,
  dest: string,
  dryRun: boolean,
  actions: Action[]
): void {
  if (dryRun) {
    actions.push({ kind: "move", detail: `${src} → ${dest}` });
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
  actions.push({ kind: "move", detail: `${src} → ${dest}` });
}

function copyDirIfMissing(
  src: string,
  dest: string,
  dryRun: boolean,
  actions: Action[]
): void {
  if (fs.existsSync(dest)) {
    actions.push({ kind: "skip", detail: `Destination exists: ${dest}` });
    return;
  }
  if (dryRun) {
    actions.push({ kind: "copy", detail: `${src} → ${dest}` });
    return;
  }
  fs.cpSync(src, dest, { recursive: true });
  actions.push({ kind: "copy", detail: `${src} → ${dest}` });
}

function listChangeDirs(changesDir: string): string[] {
  if (!fs.existsSync(changesDir)) return [];
  return fs
    .readdirSync(changesDir)
    .filter((n) => {
      if (n.startsWith("_") || n === "archive" || n.startsWith(".")) return false;
      return fs.statSync(path.join(changesDir, n)).isDirectory();
    });
}

function destFromPath(specxDir: string, featurePath: string): string {
  return path.join(specxDir, ...featurePath.split("/"));
}

function migrateChangesFolder(
  specxDir: string,
  map: Record<string, string>,
  opts: MigrateOptions,
  actions: Action[]
): Map<string, string> {
  const renames = new Map<string, string>();
  const changesDir = path.join(specxDir, "changes");

  for (const oldName of listChangeDirs(changesDir)) {
    const targetPath = map[oldName]
      ? validateFeaturePath(map[oldName])
      : validateFeaturePath(oldName);
    renames.set(oldName, targetPath);

    const src = path.join(changesDir, oldName);
    const dest = destFromPath(specxDir, targetPath);

    if (fs.existsSync(dest) && isFeatureLeafDir(dest)) {
      actions.push({
        kind: "skip",
        detail: `Already migrated: ${targetPath} (merge ${oldName} manually)`,
      });
      renameProposalToFeature(dest, !!opts.dryRun, actions);
      continue;
    }

    if (!opts.keepLegacyDirs) {
      moveDir(src, dest, !!opts.dryRun, actions);
    } else {
      copyDirIfMissing(src, dest, !!opts.dryRun, actions);
    }
    renameProposalToFeature(dest, !!opts.dryRun, actions);
  }

  return renames;
}

function migrateFeaturesBucket(
  specxDir: string,
  map: Record<string, string>,
  opts: MigrateOptions,
  actions: Action[]
): void {
  const bucket = path.join(specxDir, "features");
  if (!fs.existsSync(bucket)) return;

  function walk(current: string, segments: string[]): void {
    if (isFeatureLeafDir(current) && segments.length > 0) {
      const oldKey = segments.join("/");
      const targetPath = map[oldKey]
        ? validateFeaturePath(map[oldKey])
        : validateFeaturePath(oldKey);
      const dest = destFromPath(specxDir, targetPath);
      if (path.resolve(current) !== path.resolve(dest)) {
        if (!fs.existsSync(dest)) {
          moveDir(current, dest, !!opts.dryRun, actions);
        }
        renameProposalToFeature(dest, !!opts.dryRun, actions);
      }
      return;
    }
    for (const name of fs.readdirSync(current)) {
      if (name.startsWith("_") || name === "STRUCTURE.md") continue;
      const child = path.join(current, name);
      if (fs.statSync(child).isDirectory()) {
        walk(child, [...segments, name]);
      }
    }
  }

  for (const name of fs.readdirSync(bucket)) {
    if (name.startsWith("_") || name.startsWith(".")) continue;
    walk(path.join(bucket, name), [name]);
  }
}

function ensureNewScaffold(specxDir: string, dryRun: boolean, actions: Action[]): void {
  const files = [
    ["STRUCTURE.md", "STRUCTURE.md"],
    ["discovery/MAINTENANCE.md", "discovery/MAINTENANCE.md"],
  ];
  for (const [rel, label] of files) {
    const dest = path.join(specxDir, rel);
    if (fs.existsSync(dest)) continue;
    const src = path.join(resolvePackageTemplates(), "specx", rel);
    if (!fs.existsSync(src)) continue;
    if (dryRun) {
      actions.push({ kind: "add", detail: `Would add ${label}` });
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    actions.push({ kind: "add", detail: `Added ${label}` });
  }

  const tplDest = path.join(specxDir, "_template");
  const tplSrc = path.join(resolvePackageTemplates(), "specx", "_template");
  if (!fs.existsSync(tplDest) && fs.existsSync(tplSrc)) {
    if (dryRun) {
      actions.push({ kind: "add", detail: "Would add _template/" });
    } else {
      const config = loadConfig();
      copyFromPackageTemplates(
        "specx/_template",
        tplDest,
        defaultVars(config.project?.name ?? "project", config.track)
      );
      actions.push({ kind: "add", detail: "Added _template/" });
    }
  }
}

function syncRegistryAndCatalog(
  renames: Map<string, string>,
  dryRun: boolean,
  actions: Action[],
  projectRoot?: string
): void {
  let registry = loadRegistry(projectRoot);
  const items = { ...registry.features?.items };
  const oldActive = registry.features?.active ?? registry.changes?.active;

  for (const [oldName, newPath] of renames) {
    if (items[oldName]) {
      items[newPath] = items[oldName];
      delete items[oldName];
      actions.push({
        kind: "registry",
        detail: `Feature key ${oldName} → ${newPath}`,
      });
    }
  }

  let active = oldActive;
  if (active && renames.has(active)) {
    active = renames.get(active)!;
  }

  const { changes: _legacy, ...rest } = registry;
  registry = {
    ...rest,
    features: { active, items },
  };

  if (!dryRun) {
    saveRegistry(registry, projectRoot);
    for (const p of Object.keys(items)) {
      ensureCatalogEntry(p, undefined, projectRoot);
    }
  } else {
    actions.push({ kind: "registry", detail: "Would save registry.yaml (features only)" });
  }
}

export function runMigrateMapTemplate(projectRoot?: string): void {
  const { dotSpecxDir, specxDir } = getRoots(projectRoot);
  const out = path.join(dotSpecxDir, "migrate-map.yaml");
  const examples: string[] = [
    "# Rename legacy change folder names → new feature paths",
    "map:",
  ];
  for (const name of listChangeDirs(path.join(specxDir, "changes"))) {
    examples.push(`  ${name}: ${name}  # edit: e.g. auth/email/${name}`);
  }
  fs.writeFileSync(out, examples.join("\n") + "\n", "utf8");
  console.log(chalk.green(`Wrote ${out}`));
}

export function runMigrate(options: MigrateOptions = {}): void {
  const { specxDir, dotSpecxDir } = getRoots(options.projectRoot);
  const actions: Action[] = [];

  const explicit: Record<string, string> = {};
  if (options.map) {
    for (const [from, to] of Object.entries(options.map)) {
      explicit[from] = validateFeaturePath(to);
    }
  }

  const map = {
    ...loadMapFile(dotSpecxDir),
    ...explicit,
  };

  console.log(chalk.bold("\nspecX migrate — legacy → segmented feature tree"));
  if (options.dryRun) {
    console.log(chalk.yellow("Dry run — no files modified\n"));
  }

  const renames = migrateChangesFolder(specxDir, map, options, actions);
  migrateFeaturesBucket(specxDir, map, options, actions);
  ensureNewScaffold(specxDir, !!options.dryRun, actions);
  syncRegistryAndCatalog(renames, !!options.dryRun, actions, options.projectRoot);

  const archiveDir = path.join(specxDir, "changes", "archive");
  if (fs.existsSync(archiveDir)) {
    actions.push({
      kind: "note",
      detail: `Manual: review changes/archive/ — keep as history or document in evolution/changelog.md`,
    });
  }

  if (actions.length === 0) {
    console.log(chalk.green("Nothing to migrate — already on new layout."));
    return;
  }

  for (const a of actions) {
    const color =
      a.kind === "skip" || a.kind === "note"
        ? chalk.dim
        : a.kind === "move" || a.kind === "copy"
          ? chalk.cyan
          : chalk.green;
    console.log(color(`  [${a.kind}] ${a.detail}`));
  }

  console.log(chalk.bold("\nNext steps:"));
  console.log("  1. specx status");
  console.log("  2. specx discover impact <feature-path>  (refresh discovery if needed)");
  console.log("  3. rm -rf specx/changes  (after verifying migration)");
  console.log("  4. git add specx/ .specx/ && git commit");
  console.log(
    chalk.dim(
      "\nTip: map flat change names to nested paths via .specx/migrate-map.yaml or --map old:new/path"
    )
  );
}
