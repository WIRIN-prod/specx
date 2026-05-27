import { describe, it, expect } from "vitest";
import {
  analyzeFeatureImpact,
  baselinePhaseImpacts,
} from "../src/lib/discovery-impact.js";

describe("discovery-impact", () => {
  it("always requires phases 07 and 08 on standard track", () => {
    const base = baselinePhaseImpacts("standard");
    expect(base.some((b) => b.phase === 7 && b.priority === "required")).toBe(true);
    expect(base.some((b) => b.phase === 8 && b.priority === "required")).toBe(true);
  });

  it("flags security phase on enterprise track from feature text", () => {
    const impacts = analyzeFeatureImpact(
      "auth/email/registration",
      "enterprise",
      "OAuth login and password reset with PII encryption"
    );
    expect(impacts.some((i) => i.phase === 10)).toBe(true);
  });

  it("flags IA phases from navigation keywords on standard track", () => {
    const impacts = analyzeFeatureImpact(
      "app/settings",
      "standard",
      "New settings screen and navigation flow"
    );
    expect(impacts.some((i) => i.phase === 5)).toBe(true);
  });
});
