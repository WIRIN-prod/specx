import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: ["src/cli.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "dist/cli.js",
  external: ["commander", "chalk", "ora", "yaml", "zod"],
  sourcemap: true,
});

const templatesSource = join(__dirname, "templates");
const templatesDest = join(__dirname, "dist", "templates");
if (existsSync(templatesSource)) {
  mkdirSync(join(__dirname, "dist"), { recursive: true });
  rmSync(templatesDest, { recursive: true, force: true });
  cpSync(templatesSource, templatesDest, { recursive: true });
}

// Keep in sync with renderSkill in src/lib/skills.ts.
function renderSkill(skill, name) {
  const read = (rel) => readFileSync(join(templatesSource, rel), "utf8").replace(/\r\n/g, "\n");
  const rules = read("RULES.md").trim().replace(/^# SpecX rules\n+/, "");
  return read(join("skills", skill, "SKILL.md")).replaceAll("{{SKILL_NAME}}", name).replaceAll("{{RULES}}", rules);
}

// The Claude Code plugin is generated from the same templates, so it cannot drift.
const pluginSkills = join(__dirname, "plugins", "specx", "skills");
rmSync(pluginSkills, { recursive: true, force: true });
for (const skill of ["plan", "execute", "review"]) {
  mkdirSync(join(pluginSkills, skill), { recursive: true });
  writeFileSync(join(pluginSkills, skill, "SKILL.md"), renderSkill(skill, skill), "utf8");
}

console.log("Built dist/cli.js and plugins/specx/skills");
