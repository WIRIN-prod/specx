import { describe, it, expect } from "vitest";
import { findProjectRoot, getRoots } from "../src/lib/paths.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("paths", () => {
  it("finds project root with .specx", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-test-"));
    fs.mkdirSync(path.join(tmp, ".specx"));
    fs.writeFileSync(path.join(tmp, ".specx", "specx.yaml"), "track: standard\n");
    const root = findProjectRoot(tmp);
    expect(root).toBe(tmp);
    fs.rmSync(tmp, { recursive: true });
  });

  it("getRoots returns specx and dotSpecx dirs", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-test-"));
    fs.mkdirSync(path.join(tmp, "specx"));
    fs.writeFileSync(path.join(tmp, "specx", "SPECX.md"), "# test\n");
    const roots = getRoots(tmp);
    expect(roots.specxDir).toBe(path.join(tmp, "specx"));
    expect(roots.dotSpecxDir).toBe(path.join(tmp, ".specx"));
    fs.rmSync(tmp, { recursive: true });
  });
});
