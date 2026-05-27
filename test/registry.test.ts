import { describe, it, expect } from "vitest";
import {
  defaultRegistry,
  normalizeRegistryRaw,
  RegistrySchema,
} from "../schemas/registry.js";
import { TRACK_PHASES } from "../schemas/specx-config.js";

describe("registry", () => {
  it("defaultRegistry includes enterprise phases", () => {
    const reg = defaultRegistry(TRACK_PHASES.enterprise);
    expect(reg.features?.items).toEqual({});
    expect(reg.discovery?.phases?.["01"]?.status).toBe("pending");
    expect(reg.discovery?.phases?.["11"]?.status).toBe("pending");
  });

  it("quick track has phases 07-09", () => {
    const reg = defaultRegistry(TRACK_PHASES.quick);
    expect(reg.discovery?.phases?.["07"]).toBeDefined();
    expect(reg.discovery?.phases?.["01"]).toBeUndefined();
  });

  it("parses revision change status and extra item fields", () => {
    const parsed = RegistrySchema.parse({
      version: 1,
      features: {
        items: {
          "slice-1": {
            status: "revision",
            phase: "revision",
            tasks_total: 45,
          },
        },
      },
    });
    expect(parsed.features?.items?.["slice-1"]?.status).toBe("revision");
    expect(
      (parsed.features?.items?.["slice-1"] as { tasks_total?: number })
        ?.tasks_total
    ).toBe(45);
  });

  it("normalizeRegistryRaw maps created to created_at", () => {
    const { value, changed } = normalizeRegistryRaw({
      version: 1,
      changes: {
        items: {
          "slice-1-shell": { status: "approved", created: "2026-05-22" },
        },
      },
    });
    expect(changed).toBe(true);
    const parsed = RegistrySchema.parse(value);
    expect(parsed.features?.items?.["slice-1-shell"]?.created_at).toBe(
      "2026-05-22"
    );
  });

  it("normalizeRegistryRaw adds created_at and keeps approved status", () => {
    const { value } = normalizeRegistryRaw({
      version: 1,
      features: {
        items: {
          "slice-1-shell": { status: "approved" },
        },
      },
    });
    const parsed = RegistrySchema.parse(value);
    expect(parsed.features?.items?.["slice-1-shell"]?.status).toBe("approved");
    expect(parsed.features?.items?.["slice-1-shell"]?.created_at).toBeDefined();
  });
});
