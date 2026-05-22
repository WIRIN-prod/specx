import { describe, it, expect } from "vitest";
import {
  parseTasksMarkdown,
  formatTaskBar,
  taskCountsFromItem,
} from "../src/lib/tasks.js";

describe("tasks", () => {
  it("parseTasksMarkdown counts checkboxes", () => {
    const md = `
# Tasks
- [x] 1.1 Done
- [ ] 1.2 Todo
- [X] 2.1 Also done
`;
    const p = parseTasksMarkdown(md);
    expect(p.total).toBe(3);
    expect(p.completed).toBe(2);
    expect(p.incomplete).toHaveLength(1);
    expect(p.incomplete[0].id).toBe("1.2");
    expect(p.completedItems).toHaveLength(2);
  });

  it("taskCountsFromItem prefers tasks.md over registry", () => {
    const fromFile = parseTasksMarkdown("- [x] 1.1\n- [ ] 1.2\n");
    const counts = taskCountsFromItem(
      { tasks_total: 99, tasks_completed: 50 },
      fromFile
    );
    expect(counts.total).toBe(2);
    expect(counts.completed).toBe(1);
    expect(counts.source).toBe("tasks.md");
  });

  it("formatTaskBar renders progress", () => {
    expect(formatTaskBar(1, 4)).toContain("1/4");
    expect(formatTaskBar(1, 4)).toContain("25%");
  });
});
