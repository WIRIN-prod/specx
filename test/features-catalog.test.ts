import { describe, it, expect } from "vitest";
import { FeaturesCatalogSchema } from "../schemas/features-catalog.js";
import { normalizeRegistryRaw } from "../schemas/registry.js";

describe("features catalog", () => {
  it("accepts depends_on M→M edges", () => {
    const cat = FeaturesCatalogSchema.parse({
      version: 1,
      features: {
        "auth/core-session": { title: "Auth", depends_on: [] },
        "auth/email/registration": {
          title: "Registration",
          depends_on: ["auth/core-session"],
        },
        "platform/storage": { title: "Storage", depends_on: [] },
      },
    });
    expect(cat.features["auth/email/registration"].depends_on).toEqual([
      "auth/core-session",
    ]);
  });

  it("migrates legacy changes block to features", () => {
    const { value, changed } = normalizeRegistryRaw({
      version: 1,
      changes: { active: "foo", items: { foo: { status: "spec" } } },
    });
    expect(changed).toBe(true);
    const reg = value as { features?: { active?: string; items?: Record<string, unknown> } };
    expect(reg.features?.active).toBe("foo");
    expect(reg.features?.items?.foo).toBeDefined();
  });
});
