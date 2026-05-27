import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parse as parseYaml } from "yaml";
import { runMigrate } from "../src/commands/migrate.js";

describe("specx migrate", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-migrate-"));
    fs.mkdirSync(path.join(tmp, ".specx"), { recursive: true });
    fs.mkdirSync(path.join(tmp, "specx"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "specx", "SPECX.md"), "# specX\n");
    fs.mkdirSync(path.join(tmp, "specx", "changes", "demo-feature"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tmp, "specx", "changes", "demo-feature", "proposal.md"),
      "# Demo\n"
    );
    fs.writeFileSync(
      path.join(tmp, ".specx", "registry.yaml"),
      `features:
  active: demo-feature
  items:
    demo-feature:
      status: proposed
      created_at: "2025-01-01T00:00:00.000Z"
`
    );
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("dry-run reports move without writing", () => {
    runMigrate({ dryRun: true, projectRoot: tmp });
    expect(fs.existsSync(path.join(tmp, "specx", "changes", "demo-feature"))).toBe(
      true
    );
    expect(fs.existsSync(path.join(tmp, "specx", "demo-feature"))).toBe(false);
  });

  it("moves change to feature path and renames proposal", () => {
    runMigrate({
      projectRoot: tmp,
      map: { "demo-feature": "auth/demo-feature" },
    });
    const leaf = path.join(tmp, "specx", "auth", "demo-feature");
    expect(fs.existsSync(leaf)).toBe(true);
    expect(fs.existsSync(path.join(leaf, "FEATURE.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "changes", "demo-feature"))).toBe(
      false
    );
    const reg = parseYaml(
      fs.readFileSync(path.join(tmp, ".specx", "registry.yaml"), "utf8")
    ) as { features: { items: Record<string, unknown> } };
    expect(reg.features.items["auth/demo-feature"]).toBeDefined();
    expect(reg.features.items["demo-feature"]).toBeUndefined();
    expect(fs.existsSync(path.join(tmp, "specx", "features.yaml"))).toBe(true);
  });
});
