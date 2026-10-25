import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadBoard, parallelGroups, readyTasks, relatedTasks, writeTaskIndex } from "../src/lib/tasks.js";

function task(dir: string, id: string, fields: Record<string, string> = {}): void {
  const front = { title: id, status: "todo", depends_on: "[]", decisions: "[]", specs: "[]", files: `[src/${id}/]`, ...fields };
  const body = Object.entries(front).map(([key, value]) => `${key}: ${value}`).join("\n");
  fs.writeFileSync(path.join(dir, "tasks", `${id}.md`), `---\nid: ${id}\n${body}\n---\n\n## Goal\n`);
}

function decision(dir: string, id: string, status: string): void {
  fs.writeFileSync(path.join(dir, "decisions", `${id}.md`), `---\nid: ${id}\ntitle: x\nstatus: ${status}\n---\n`);
}

describe("task board", () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "specx-tasks-"));
    fs.mkdirSync(path.join(dir, "tasks"));
    fs.mkdirSync(path.join(dir, "decisions"));
  });
  afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }); });

  it("is ready only when dependencies are done and decisions answered", () => {
    decision(dir, "DEC-001", "answered");
    decision(dir, "DEC-002", "open");
    task(dir, "T-001", { status: "done" });
    task(dir, "T-002", { depends_on: "[T-001]", decisions: "[DEC-001]" });
    task(dir, "T-003", { decisions: "[DEC-002]" });
    task(dir, "T-004", { depends_on: "[T-002]" });
    task(dir, "T-005", { status: "draft" });
    const board = loadBoard(dir);
    expect(board.problems).toEqual([]);
    expect(readyTasks(board).map((t) => t.id)).toEqual(["T-002"]);
  });

  it("groups ready tasks so parallel tasks never share files", () => {
    task(dir, "T-001", { files: "[src/auth/]" });
    task(dir, "T-002", { files: "[src/auth/login.ts]" });
    task(dir, "T-003", { files: "[src/billing/**]" });
    task(dir, "T-004", { files: "[]" });
    const groups = parallelGroups(readyTasks(loadBoard(dir))).map((g) => g.map((t) => t.id));
    expect(groups).toEqual([["T-001", "T-003"], ["T-002"], ["T-004"]]);
  });

  it("reports unknown references and cycles", () => {
    task(dir, "T-001", { depends_on: "[T-002]" });
    task(dir, "T-002", { depends_on: "[T-001]", decisions: "[DEC-009]" });
    task(dir, "T-003", { depends_on: "[T-404]" });
    const problems = loadBoard(dir).problems.join("\n");
    expect(problems).toContain("T-002: references unknown decision DEC-009");
    expect(problems).toContain("T-003: depends on unknown task T-404");
    expect(problems).toContain("dependency cycle");
  });

  it("finds related tasks to pause: dependents, unfinished dependencies, shared specs", () => {
    task(dir, "T-001", { status: "in-progress" });
    task(dir, "T-002", { status: "in-progress", depends_on: "[T-001]", specs: "[A.B]" });
    task(dir, "T-003", { depends_on: "[T-002]" });
    task(dir, "T-004", { specs: "[A.B]" });
    task(dir, "T-005", { status: "in-progress" });
    task(dir, "T-006", { status: "done", specs: "[A.B]" });
    const related = relatedTasks(loadBoard(dir), "T-002").map((t) => t.id);
    expect(related).toEqual(["T-001", "T-003", "T-004"]);
  });

  it("regenerates the TASKS.md table and keeps surrounding text", () => {
    fs.writeFileSync(path.join(dir, "tasks", "TASKS.md"), "# Tasks\n\nIntro.\n\n<!-- specx:tasks:begin -->\nold\n<!-- specx:tasks:end -->\n\nFooter.\n");
    task(dir, "T-002", { title: "Second", depends_on: "[T-001]" });
    task(dir, "T-001", { title: "First", status: "done", pr: "https://example.test/pr/1" });
    writeTaskIndex(dir, loadBoard(dir));
    const text = fs.readFileSync(path.join(dir, "tasks", "TASKS.md"), "utf8");
    expect(text).toContain("Intro.");
    expect(text).toContain("Footer.");
    expect(text).not.toContain("old");
    expect(text).toContain("| [T-001](T-001.md) | First | done | — | — | — | https://example.test/pr/1 |");
    expect(text.indexOf("T-001")).toBeLessThan(text.indexOf("T-002"));
  });
});
