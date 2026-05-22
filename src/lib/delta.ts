import fs from "node:fs";
import path from "node:path";

const DELTA_SECTIONS = [
  "## ADDED Requirements",
  "## MODIFIED Requirements",
  "## REMOVED Requirements",
] as const;

export function parseDeltaSpec(content: string): {
  added: string;
  modified: string;
  removed: string;
  preamble: string;
} {
  const result = {
    added: "",
    modified: "",
    removed: "",
    preamble: "",
  };

  let current: keyof typeof result | null = null;
  const lines = content.split("\n");
  const buckets: Record<string, string[]> = {
    preamble: [],
    added: [],
    modified: [],
    removed: [],
  };

  for (const line of lines) {
    if (line.startsWith("## ADDED Requirements")) {
      current = "added";
      continue;
    }
    if (line.startsWith("## MODIFIED Requirements")) {
      current = "modified";
      continue;
    }
    if (line.startsWith("## REMOVED Requirements")) {
      current = "removed";
      continue;
    }
    const key = current ?? "preamble";
    buckets[key].push(line);
  }

  result.preamble = buckets.preamble.join("\n").trim();
  result.added = buckets.added.join("\n").trim();
  result.modified = buckets.modified.join("\n").trim();
  result.removed = buckets.removed.join("\n").trim();
  return result;
}

export function mergeDeltaIntoSpec(
  livingSpec: string,
  deltaContent: string
): string {
  const delta = parseDeltaSpec(deltaContent);
  let base = livingSpec.trim();

  if (delta.added) {
    if (!base.includes("## ADDED Requirements")) {
      base += "\n\n## Requirements\n";
    }
    base += "\n\n<!-- merged from change delta -->\n" + delta.added;
  }

  if (delta.modified) {
    base += "\n\n<!-- MODIFIED requirements applied -->\n" + delta.modified;
  }

  if (delta.removed) {
    base += "\n\n<!-- REMOVED (review manually) -->\n" + delta.removed;
  }

  return base.trim() + "\n";
}

export function mergeChangeDeltas(
  specxDir: string,
  changeName: string
): string[] {
  const deltaDir = path.join(specxDir, "changes", changeName, "specs");
  const livingDir = path.join(specxDir, "specs");
  const updated: string[] = [];

  if (!fs.existsSync(deltaDir)) return updated;

  for (const domain of fs.readdirSync(deltaDir)) {
    const deltaPath = path.join(deltaDir, domain, "spec.md");
    if (!fs.existsSync(deltaPath)) continue;

    const livingPath = path.join(livingDir, domain, "spec.md");
    const deltaContent = fs.readFileSync(deltaPath, "utf8");

    if (fs.existsSync(livingPath)) {
      const living = fs.readFileSync(livingPath, "utf8");
      fs.writeFileSync(
        livingPath,
        mergeDeltaIntoSpec(living, deltaContent),
        "utf8"
      );
    } else {
      fs.mkdirSync(path.dirname(livingPath), { recursive: true });
      fs.writeFileSync(livingPath, deltaContent, "utf8");
    }
    updated.push(path.join("specx", "specs", domain, "spec.md"));
  }

  return updated;
}

export function formatDiffSummary(
  specxDir: string,
  changeName: string
): string {
  const deltaDir = path.join(specxDir, "changes", changeName, "specs");
  if (!fs.existsSync(deltaDir)) {
    return "No delta specs in this change.";
  }

  const lines: string[] = [`Change: ${changeName}`, ""];
  for (const domain of fs.readdirSync(deltaDir)) {
    const p = path.join(deltaDir, domain, "spec.md");
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf8");
    for (const section of DELTA_SECTIONS) {
      if (content.includes(section)) {
        lines.push(`  ${domain}: ${section}`);
      }
    }
  }
  return lines.join("\n");
}
