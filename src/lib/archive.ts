import fs from "node:fs";
import path from "node:path";
import { mergeChangeDeltas } from "./delta.js";
import { getRoots } from "./paths.js";

export function archiveChange(
  changeName: string,
  projectRoot?: string
): { archivePath: string; updatedSpecs: string[] } {
  const { specxDir, projectRoot: root } = getRoots(projectRoot);
  const changeDir = path.join(specxDir, "changes", changeName);

  if (!fs.existsSync(changeDir)) {
    throw new Error(`Change not found: ${changeName}`);
  }

  const updatedSpecs = mergeChangeDeltas(specxDir, changeName);

  const date = new Date().toISOString().slice(0, 10);
  const archiveName = `${date}-${changeName}`;
  const archiveDir = path.join(specxDir, "changes", "archive", archiveName);

  fs.mkdirSync(path.dirname(archiveDir), { recursive: true });
  fs.renameSync(changeDir, archiveDir);

  appendChangelogEntry(root, specxDir, archiveName, changeName);

  return { archivePath: archiveDir, updatedSpecs };
}

function appendChangelogEntry(
  _root: string,
  specxDir: string,
  archiveName: string,
  changeName: string
): void {
  const changelogPath = path.join(specxDir, "evolution", "changelog.md");
  const entry = `\n## ${archiveName}\n\n- Archived change: **${changeName}**\n- Date: ${new Date().toISOString().slice(0, 10)}\n`;

  if (fs.existsSync(changelogPath)) {
    fs.appendFileSync(changelogPath, entry, "utf8");
  } else {
    fs.mkdirSync(path.dirname(changelogPath), { recursive: true });
    fs.writeFileSync(
      changelogPath,
      `# Changelog\n\nProduct changes from archived specX changes.\n${entry}`,
      "utf8"
    );
  }
}

export function regenerateChangelog(specxDir: string): void {
  const archiveDir = path.join(specxDir, "changes", "archive");
  let body = "# Changelog\n\nProduct changes from archived specX changes.\n";

  if (fs.existsSync(archiveDir)) {
    const entries = fs
      .readdirSync(archiveDir)
      .filter((n) => !n.startsWith("."))
      .sort()
      .reverse();

    for (const name of entries) {
      body += `\n## ${name}\n\n- Archived change folder: \`${name}\`\n`;
    }
  }

  const changelogPath = path.join(specxDir, "evolution", "changelog.md");
  fs.mkdirSync(path.dirname(changelogPath), { recursive: true });
  fs.writeFileSync(changelogPath, body, "utf8");
}
