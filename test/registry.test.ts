import { describe, it, expect } from "vitest";
import { defaultRegistry } from "../schemas/registry.js";
import { TRACK_PHASES } from "../schemas/specx-config.js";

describe("registry", () => {
  it("defaultRegistry includes enterprise phases", () => {
    const reg = defaultRegistry(TRACK_PHASES.enterprise);
    expect(reg.discovery?.phases?.["01"]?.status).toBe("pending");
    expect(reg.discovery?.phases?.["11"]?.status).toBe("pending");
  });

  it("quick track has phases 07-09", () => {
    const reg = defaultRegistry(TRACK_PHASES.quick);
    expect(reg.discovery?.phases?.["07"]).toBeDefined();
    expect(reg.discovery?.phases?.["01"]).toBeUndefined();
  });
});
