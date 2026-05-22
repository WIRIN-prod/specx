import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { getRoots } from "./paths.js";

export function generateDriftReport(projectRoot?: string): string {
  const { projectRoot: root, specxDir } = getRoots(projectRoot);
  const specsDir = path.join(specxDir, "specs");

  const specKeywords = new Set<string>();
  if (fs.existsSync(specsDir)) {
    for (const domain of fs.readdirSync(specsDir)) {
      const specPath = path.join(specsDir, domain, "spec.md");
      if (!fs.existsSync(specPath)) continue;
      const content = fs.readFileSync(specPath, "utf8");
      const reqs = content.match(/### Requirement:\s*(.+)/g) ?? [];
      for (const r of reqs) {
        specKeywords.add(r.replace("### Requirement:", "").trim().toLowerCase());
      }
    }
  }

  const codeFiles = fg.sync(
    ["**/*.{ts,tsx,js,jsx,py,go,rs}"],
    {
      cwd: root,
      ignore: ["**/node_modules/**", "**/dist/**", "**/specx/**", "**/.specx/**"],
      absolute: false,
    }
  );

  const lines: string[] = [
    "# Drift Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- Spec domains scanned: ${fs.existsSync(specsDir) ? fs.readdirSync(specsDir).length : 0}`,
    `- Code files scanned: ${codeFiles.length}`,
    `- Requirements indexed: ${specKeywords.size}`,
    "",
    "## Heuristic findings",
    "",
    "This v1 report uses keyword overlap. Review manually and update specs when drift is confirmed.",
    "",
  ];

  if (specKeywords.size === 0) {
    lines.push("_No living specs found. Run discovery and build loops first._\n");
  } else {
    lines.push("### Spec requirements to verify in code\n");
    for (const kw of [...specKeywords].slice(0, 20)) {
      lines.push(`- [ ] ${kw}`);
    }
    if (specKeywords.size > 20) {
      lines.push(`- _...and ${specKeywords.size - 20} more_`);
    }
  }

  return lines.join("\n");
}

export function writeDriftReport(projectRoot?: string): string {
  const { specxDir } = getRoots(projectRoot);
  const report = generateDriftReport(projectRoot);
  const outPath = path.join(specxDir, "evolution", "drift-report.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, report, "utf8");
  return outPath;
}
