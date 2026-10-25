import fs from "node:fs";
import path from "node:path";
import { resolvePackageTemplates } from "./paths.js";

export const SKILLS = ["plan", "execute", "review"] as const;
export type Skill = (typeof SKILLS)[number];

export function readRules(): string {
  return fs.readFileSync(path.join(resolvePackageTemplates(), "RULES.md"), "utf8").replace(/\r\n/g, "\n").trim();
}

/** Renders a bundled skill. Keep in sync with renderSkill in build.js, which generates the Claude plugin. */
export function renderSkill(skill: Skill, name: string): string {
  const raw = fs.readFileSync(path.join(resolvePackageTemplates(), "skills", skill, "SKILL.md"), "utf8").replace(/\r\n/g, "\n");
  const rules = readRules().replace(/^# SpecX rules\n+/, "");
  return raw.replaceAll("{{SKILL_NAME}}", name).replaceAll("{{RULES}}", rules);
}
