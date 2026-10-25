import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { runInit } from "../src/commands/init.js";
import { renderSkill, SKILLS } from "../src/lib/skills.js";

describe("init integration", () => {
  let tmp: string;
  beforeEach(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-init-")); });
  afterEach(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

  it("scaffolds the specs, decisions, tasks, and reviews layout", async () => {
    await runInit(tmp);
    for (const rel of ["Home.md", "RULES.md", "specs/README.md", "decisions/README.md", "tasks/TASKS.md", "reviews/README.md"]) {
      expect(fs.existsSync(path.join(tmp, "specx", rel)), rel).toBe(true);
    }
    expect(fs.existsSync(path.join(tmp, "specx", "knowledge"))).toBe(false);
  });

  it("installs only plan, execute, and review for every host", async () => {
    await runInit(tmp);
    for (const host of [".agents/skills", ".claude/skills", ".cursor/skills", ".github/skills"]) {
      expect(fs.readdirSync(path.join(tmp, host)).sort()).toEqual(["specx-execute", "specx-plan", "specx-review"]);
    }
    expect(fs.existsSync(path.join(tmp, ".claude", "commands"))).toBe(false);
    expect(fs.existsSync(path.join(tmp, ".cursor", "commands"))).toBe(false);
  });

  it("puts the same rules in every place an agent reads", async () => {
    await runInit(tmp);
    const rules = fs.readFileSync(path.join(process.cwd(), "templates", "RULES.md"), "utf8").replace(/\r\n/g, "\n").trim();
    for (const rel of ["specx/RULES.md", "AGENTS.md", "CLAUDE.md", ".github/copilot-instructions.md", ".cursor/rules/specx.mdc"]) {
      expect(fs.readFileSync(path.join(tmp, rel), "utf8"), rel).toContain(rules);
    }
    for (const skill of SKILLS) {
      const text = fs.readFileSync(path.join(tmp, ".claude", "skills", `specx-${skill}`, "SKILL.md"), "utf8");
      expect(text).toContain("## 1. The user makes every decision");
      expect(text).toContain("## 3. Always maintain the task list");
      expect(text).not.toContain("{{");
    }
  });

  it("removes rules and skills for deselected hosts but keeps user content", async () => {
    fs.writeFileSync(path.join(tmp, "CLAUDE.md"), "# My notes\n");
    await runInit(tmp, "claude,cursor");
    expect(fs.readFileSync(path.join(tmp, "CLAUDE.md"), "utf8")).toContain("# My notes");
    await runInit(tmp, "codex");
    expect(fs.readFileSync(path.join(tmp, "CLAUDE.md"), "utf8")).toBe("# My notes\n");
    expect(fs.existsSync(path.join(tmp, ".cursor", "rules", "specx.mdc"))).toBe(false);
    expect(fs.readdirSync(path.join(tmp, ".claude", "skills"))).toEqual([]);
    expect(fs.readdirSync(path.join(tmp, ".agents", "skills")).sort()).toEqual(["specx-execute", "specx-plan", "specx-review"]);
  });

  it("removes skills and command wrappers from earlier versions", async () => {
    fs.mkdirSync(path.join(tmp, ".claude", "skills", "specx-discover"), { recursive: true });
    fs.mkdirSync(path.join(tmp, ".claude", "commands", "specx"), { recursive: true });
    fs.writeFileSync(path.join(tmp, ".claude", "commands", "specx", "approve.md"), "old");
    fs.mkdirSync(path.join(tmp, ".specx", "commands"), { recursive: true });
    await runInit(tmp, "claude");
    expect(fs.existsSync(path.join(tmp, ".claude", "skills", "specx-discover"))).toBe(false);
    expect(fs.existsSync(path.join(tmp, ".claude", "commands", "specx"))).toBe(false);
    expect(fs.existsSync(path.join(tmp, ".specx", "commands"))).toBe(false);
  });

  it("ships the same skills in the Claude plugin as in host skills", () => {
    for (const skill of SKILLS) {
      const plugin = fs.readFileSync(path.join(process.cwd(), "plugins", "specx", "skills", skill, "SKILL.md"), "utf8");
      expect(plugin, `${skill}: run npm run build`).toBe(renderSkill(skill, skill));
    }
  });

  it("preserves existing records and configuration", async () => {
    fs.mkdirSync(path.join(tmp, "specx", "tasks"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "specx", "tasks", "TASKS.md"), "# Existing\n");
    fs.mkdirSync(path.join(tmp, ".specx"), { recursive: true });
    fs.writeFileSync(path.join(tmp, ".specx", "specx.yaml"), "project:\n  name: mine\ngit:\n  main_branch: trunk\n");
    await runInit(tmp);
    expect(fs.readFileSync(path.join(tmp, "specx", "tasks", "TASKS.md"), "utf8")).toBe("# Existing\n");
    const config = parseYaml(fs.readFileSync(path.join(tmp, ".specx", "specx.yaml"), "utf8"));
    expect(config.project.name).toBe("mine");
    expect(config.git.main_branch).toBe("trunk");
  });
});
