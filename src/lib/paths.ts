import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface SpecxRoots {
  projectRoot: string;
  specxDir: string;
  dotSpecxDir: string;
}

export function findProjectRoot(startDir: string = process.cwd()): string {
  let dir = path.resolve(startDir);
  const root = path.parse(dir).root;

  while (true) {
    if (
      existsSync(path.join(dir, ".specx", "specx.yaml")) ||
      existsSync(path.join(dir, "specx", "Home.md"))
    ) {
      return dir;
    }
    if (dir === root) break;
    dir = path.dirname(dir);
  }

  return path.resolve(startDir);
}

export function getRoots(projectRoot?: string): SpecxRoots {
  const root = projectRoot ?? findProjectRoot();
  return {
    projectRoot: root,
    specxDir: path.join(root, "specx"),
    dotSpecxDir: path.join(root, ".specx"),
  };
}

export function getPackageRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  if (here.endsWith(`${path.sep}dist${path.sep}lib`) || here.endsWith(`${path.sep}dist`)) {
    return path.join(here, "..", "..");
  }
  return path.join(here, "..", "..");
}

export function resolvePackageTemplates(): string {
  const candidates = [
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "templates"),
    path.join(getPackageRoot(), "templates"),
    path.join(getPackageRoot(), "dist", "templates"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[1];
}
