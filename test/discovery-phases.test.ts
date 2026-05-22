import { describe, it, expect } from "vitest";
import { formatPhaseLabel } from "../src/lib/discovery-phases.js";

describe("discovery-phases", () => {
  it("formatPhaseLabel includes number and title", () => {
    expect(formatPhaseLabel(1)).toBe("01 Problem definition");
    expect(formatPhaseLabel(9)).toBe("09 Technical spec");
  });
});
