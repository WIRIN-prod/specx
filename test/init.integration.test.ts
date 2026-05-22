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
    expect(rules).toContain("/specx:propose");
  });
});
