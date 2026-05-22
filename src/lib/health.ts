import fs from "node:fs";
import path from "node:path";
import { getRoots } from "./paths.js";

export function generateHealthReport(projectRoot?: string): string {
  const { specxDir } = getRoots(projectRoot);
  const specsDir = path.join(specxDir, "specs");
  const archiveDir = path.join(specxDir, "changes", "archive");

  const lines: string[] = [
    "# Spec Health",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Living specs",
    "",
  ];

  if (!fs.existsSync(specsDir)) {
    lines.push("_No specs directory._\n");
  } else {
    for (const domain of fs.readdirSync(specsDir)) {
      const p = path.join(specsDir, domain, "spec.md");
      if (!fs.existsSync(p)) continue;
      const stat = fs.statSync(p);
      const ageDays = Math.floor(
        (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24)
      );
      const stale = ageDays > 90 ? " ⚠️ stale" : "";
      lines.push(`- **${domain}**: last modified ${ageDays}d ago${stale}`);
    }
  }

  lines.push("", "## Archived changes", "");
  if (fs.existsSync(archiveDir)) {
    const count = fs.readdirSync(archiveDir).filter((n) => !n.startsWith(".")).length;
    lines.push(`- Total archived: ${count}`);
  } else {
    lines.push("_None yet._");
  }

  lines.push(
    "",
    "## Risk notes",
    "",
    "- Specs not updated in 90+ days are flagged stale.",
    "- Run `specx drift` after significant code changes.",
    ""
  );

  return lines.join("\n");
}

export function writeHealthReport(projectRoot?: string): string {
  const { specxDir } = getRoots(projectRoot);
  const report = generateHealthReport(projectRoot);
  const outPath = path.join(specxDir, "evolution", "spec-health.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, report, "utf8");
  return outPath;
}
