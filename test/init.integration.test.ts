import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { runInit } from "../src/commands/init.js";

describe("init integration", () => {
  let tmp: string;
  beforeEach(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-init-")); });
  afterEach(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

  it("scaffolds a Markdown knowledge base and host integrations", async () => {
    await runInit(tmp);
    expect(fs.existsSync(path.join(tmp, ".specx", "specx.yaml"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, ".specx", "AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "Home.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "knowledge", "README.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "proposals", "PROPOSAL-TEMPLATE.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "plans", "README.md"))).toBe(true);
    expect(fs.existsSync(path.join(tmp, "specx", "work", "CHECKPOINT.md"))).toBe(true);
  });

  it("marks scaffold knowledge unresolved and does not claim discovery is complete", async () => {
    await runInit(tmp);
    const index = fs.readFileSync(path.join(tmp, "specx", "knowledge", "README.md"), "utf8");
    expect(index).toContain("unresolved");
    expect(index).toContain("Coverage is not complete");
    expect(fs.readFileSync(path.join(tmp, "specx", "Home.md"), "utf8")).toContain("Coverage: not assessed");
  });

  it("installs seven skills for Codex, Claude Code, Cursor, and Copilot", async () => {
    await runInit(tmp);
    const expected = ["specx-approve", "specx-discover", "specx-execute", "specx-plan", "specx-propose", "specx-resume", "specx-review"];
    for (const host of [".agents/skills", ".claude/skills", ".cursor/skills", ".github/skills"]) {
      expect(fs.readdirSync(path.join(tmp, host)).sort()).toEqual(expected);
      for (const skill of expected) expect(fs.existsSync(path.join(tmp, host, skill, "SKILL.md"))).toBe(true);
    }
  });

  it("creates command wrappers for Claude Code and Cursor", async () => {
    await runInit(tmp);
    expect(fs.readdirSync(path.join(tmp, ".claude", "commands", "specx")).sort()).toEqual([
      "approve.md", "discover.md", "execute.md", "plan.md", "propose.md", "resume.md", "review.md",
    ]);
    expect(fs.readdirSync(path.join(tmp, ".cursor", "commands")).filter((name) => name.startsWith("specx-")).sort()).toHaveLength(7);
  });

  it("does not require Plane credentials or create Plane configuration", async () => {
    await runInit(tmp);
    const config = parseYaml(fs.readFileSync(path.join(tmp, ".specx", "specx.yaml"), "utf8"));
    expect(config.project.name).toBe(path.basename(tmp));
    expect(config.tracker).toBeUndefined();
    expect(config.plane).toBeUndefined();
    expect(fs.existsSync(path.join(tmp, ".env.example"))).toBe(false);
  });

  it("preserves existing knowledge and configuration", async () => {
    fs.mkdirSync(path.join(tmp, "specx", "knowledge"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "specx", "knowledge", "product.md"), "# Existing user record\n");
    fs.mkdirSync(path.join(tmp, ".specx"), { recursive: true });
    fs.writeFileSync(path.join(tmp, ".specx", "specx.yaml"), "project:\n  name: user's name\n  stack: custom\n");
    await runInit(tmp);
    expect(fs.readFileSync(path.join(tmp, "specx", "knowledge", "product.md"), "utf8")).toBe("# Existing user record\n");
    const config = parseYaml(fs.readFileSync(path.join(tmp, ".specx", "specx.yaml"), "utf8"));
    expect(config.project.name).toBe("user's name");
    expect(config.project.stack).toBe("custom");
  });
});
