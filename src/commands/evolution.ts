import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { getRoots } from "../lib/paths.js";
import { writeDriftReport } from "../lib/drift.js";
import { writeHealthReport } from "../lib/health.js";
import { regenerateChangelog } from "../lib/archive.js";
import { defaultVars, writeFromTemplate } from "../lib/template.js";
import { loadConfig } from "../lib/config.js";

export function runDrift(): void {
  const out = writeDriftReport();
  console.log(chalk.green(`Drift report: ${out}`));
}

export function runHealth(): void {
  const out = writeHealthReport();
  console.log(chalk.green(`Health report: ${out}`));
}

export function runChangelog(): void {
  const { specxDir } = getRoots();
  regenerateChangelog(specxDir);
  console.log(chalk.green(`Changelog: ${path.join(specxDir, "evolution", "changelog.md")}`));
}

export function runRetro(changeName: string): void {
  const { specxDir, projectRoot } = getRoots();
  const archiveGlob = path.join(specxDir, "changes", "archive");
  let archiveName = changeName;

  if (!fs.existsSync(path.join(archiveGlob, changeName))) {
    const matches = fs.existsSync(archiveGlob)
      ? fs.readdirSync(archiveGlob).filter((n) => n.includes(changeName))
      : [];
    if (matches.length === 1) archiveName = matches[0];
  }

  const outPath = path.join(
    specxDir,
    "evolution",
    "retrospectives",
    `${archiveName}.md`
  );

  const vars = defaultVars(
    loadConfig().project?.name ?? path.basename(projectRoot),
    loadConfig().track
  );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  try {
    writeFromTemplate("specx/evolution/retrospectives/_template.md", outPath, vars);
  } catch {
    fs.writeFileSync(
      outPath,
      `# Retrospective: ${archiveName}\n\n## Spec vs implementation\n\n## Gaps\n\n## Actions\n`,
      "utf8"
    );
  }
  console.log(chalk.green(`Retro: ${outPath}`));
}
