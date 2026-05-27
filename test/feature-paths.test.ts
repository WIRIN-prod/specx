import { describe, it, expect } from "vitest";
import {
  normalizeFeaturePath,
  classifySegment,
  discoverFeaturePaths,
} from "../src/lib/feature-paths.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("feature-paths", () => {
  it("normalizes nested paths", () => {
    expect(normalizeFeaturePath("auth/email/registration")).toBe(
      "auth/email/registration"
    );
  });

  it("allows route groups and dynamic segments", () => {
    expect(normalizeFeaturePath("auth/(flows)/oauth/[provider]")).toBe(
      "auth/(flows)/oauth/[provider]"
    );
  });

  it("rejects private segments in path", () => {
    expect(() => normalizeFeaturePath("auth/_secret/login")).toThrow();
  });

  it("classifySegment kinds", () => {
    expect(classifySegment("email")).toBe("route");
    expect(classifySegment("(auth)")).toBe("group");
    expect(classifySegment("[id]")).toBe("dynamic");
    expect(classifySegment("_template")).toBe("private");
  });

  it("discovers leaf features in nested tree", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specx-feat-"));
    const root = path.join(tmp, "specx");
    const leaf = path.join(root, "auth", "email", "registration");
    fs.mkdirSync(leaf, { recursive: true });
    fs.writeFileSync(path.join(leaf, "FEATURE.md"), "# Feature\n");
    fs.mkdirSync(path.join(root, "auth", "email", "forgot-password"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(root, "auth", "email", "forgot-password", "FEATURE.md"),
      "# Feature\n"
    );
    const found = discoverFeaturePaths(path.join(tmp, "specx"));
    expect(found).toContain("auth/email/registration");
    expect(found).toContain("auth/email/forgot-password");
    fs.rmSync(tmp, { recursive: true });
  });
});
