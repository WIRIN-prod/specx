import { describe, it, expect } from "vitest";
import { formatBuildTasksSection, parseTasksMarkdown } from "../src/lib/tasks.js";

describe("build brief", () => {
  it("lists all incomplete tasks by default", () => {
    const p = parseTasksMarkdown("- [x] 1.1 Done\n- [ ] 1.2 Todo\n- [ ] 2.1 More\n");
    const section = formatBuildTasksSection(p, "all");
    expect(section).toContain("ALL open tasks (2 remaining)");
    expect(section).toContain("1.2 Todo");
    expect(section).toContain("2.1 More");
    expect(section).toContain("Do not stop after one task");
  });
});
