import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { runInit } from "../src/commands/init.js";

describe("init integration", () => {
  let tmp: string;

  afterEach(() => {
    if (tmp && fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true });
  });

  it("scaffolds enterprise project tree", async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-init-"));
    await runInit(tmp, "enterprise");
    expect(fs.existsSync(path.join(tmp, "specx", "SPECX.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".specx", "specx.yaml"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".specx", "registry.yaml"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "discovery", "01-problem-statement.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".cursor", "rules", "specx.mdc"))).toBe(true);
    const rules = fs.readFileSync(path.join(tmp, ".cursor", "rules", "specx.mdc"), "utf8");
    expect(rules).toContain("specx-propose");
    expect(rules).toContain("reference.md");
    expect(fs.existsSync(path.join(tmp, ".cursor", "skills", "specx-sdd", "reference.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".cursor", "skills", "specx-discover", "phases.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".specx", "AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".specx", "commands", "propose.md"))).toBe(true);
    expect(fs.readFileSync(path.join(tmp, ".specx", "commands", "build.md"), "utf8")).toContain(
      "fresh context"
    );
    const proposeSkill = fs.readFileSync(
      path.join(tmp, ".cursor", "skills", "specx-propose", "SKILL.md"),
      "utf8"
    );
    expect(proposeSkill).toContain("Capabilities (CRITICAL");
    expect(proposeSkill).not.toMatch(/Follow `\.specx\/commands\/propose\.md` in full/);
    expect(fs.existsSync(path.join(tmp, ".cursor", "skills", "specx-spec", "SKILL.md"))).toBe(
      true
    );
  });
});
