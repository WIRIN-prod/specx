import fs from "node:fs";
import path from "node:path";
import { resolvePackageTemplates } from "./paths.js";

export interface TemplateVars { PROJECT_NAME: string; STACK: string; DATE: string; }
export function defaultVars(projectName: string, stack = "Unknown"): TemplateVars {
  return { PROJECT_NAME: projectName, STACK: stack, DATE: new Date().toISOString().slice(0, 10) };
}
export function substitute(content: string, vars: TemplateVars): string {
  let out = content;
  for (const [key, value] of Object.entries(vars)) out = out.replaceAll(`{{${key}}}`, value);
  return out;
}
function copyTree(srcRoot: string, destRoot: string, vars: TemplateVars, overwrite: boolean): void {
  for (const name of fs.readdirSync(srcRoot)) {
    const src = path.join(srcRoot, name); const dest = path.join(destRoot, name);
    if (fs.statSync(src).isDirectory()) { fs.mkdirSync(dest, { recursive: true }); copyTree(src, dest, vars, overwrite); }
    else {
      if (!overwrite && fs.existsSync(dest)) continue;
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, substitute(fs.readFileSync(src, "utf8"), vars), "utf8");
    }
  }
}
export function copyFromPackageTemplates(subpath: string, destRoot: string, vars: TemplateVars, options: { overwrite?: boolean } = {}): void {
  const src = path.join(resolvePackageTemplates(), subpath);
  if (!fs.existsSync(src)) throw new Error(`Template not found: ${src}`);
  copyTree(src, destRoot, vars, options.overwrite ?? false);
}
export function writeFromTemplate(templateRel: string, destFile: string, vars: TemplateVars): void {
  const src = path.join(resolvePackageTemplates(), templateRel);
  const raw = fs.readFileSync(src, "utf8"); fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, substitute(raw, vars), "utf8");
}
