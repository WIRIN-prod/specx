import fs from "node:fs";
import path from "node:path";
import { resolvePackageTemplates } from "./paths.js";

export interface TemplateVars {
  PROJECT_NAME: string;
  TRACK: string;
  STACK: string;
  DATE: string;
  FEATURE_NAME?: string;
  CHANGE_NAME?: string;
}

export function defaultVars(
  projectName: string,
  track: string,
  featureName?: string
): TemplateVars {
  const name = featureName ?? "feature-id";
  return {
    PROJECT_NAME: projectName,
    TRACK: track,
    STACK: "TBD",
    DATE: new Date().toISOString().slice(0, 10),
    FEATURE_NAME: name,
    CHANGE_NAME: name,
  };
}

export function substitute(content: string, vars: TemplateVars): string {
  let out = content;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

export function copyTemplateTree(
  srcRoot: string,
  destRoot: string,
  vars: TemplateVars,
  options?: { skip?: (rel: string) => boolean }
): void {
  function walk(rel: string) {
    const src = path.join(srcRoot, rel);
    const dest = path.join(destRoot, rel);
    if (options?.skip?.(rel)) return;

    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      for (const name of fs.readdirSync(src)) {
        // Legacy OpenSpec scaffold only — use specx/_template for features
        if (rel === "changes/_template" || rel.startsWith("changes/_template/"))
          continue;
        walk(path.join(rel, name));
      }
      return;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const raw = fs.readFileSync(src, "utf8");
    fs.writeFileSync(dest, substitute(raw, vars), "utf8");
  }

  for (const name of fs.readdirSync(srcRoot)) {
    walk(name);
  }
}

export function copyFromPackageTemplates(
  subpath: string,
  destRoot: string,
  vars: TemplateVars
): void {
  const src = path.join(resolvePackageTemplates(), subpath);
  if (!fs.existsSync(src)) {
    throw new Error(`Template not found: ${src}`);
  }
  copyTemplateTree(src, destRoot, vars);
}

export function writeFromTemplate(
  templateRel: string,
  destFile: string,
  vars: TemplateVars
): void {
  const src = path.join(resolvePackageTemplates(), templateRel);
  const raw = fs.readFileSync(src, "utf8");
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, substitute(raw, vars), "utf8");
}
