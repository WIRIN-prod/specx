import fs from "node:fs";
import path from "node:path";
import { getRoots } from "./paths.js";
import { getFeatureDir } from "./features.js";

export interface TaskItem {
  id?: string;
  summary: string;
}

export interface TaskProgress {
  total: number;
  completed: number;
  incomplete: TaskItem[];
  completedItems: TaskItem[];
}

const TASK_LINE = /^- \[([ xX])\]\s*(.+)$/;

function toTaskItem(summary: string): TaskItem {
  const idMatch = summary.match(/^(\d+\.\d+)\b/);
  const id = idMatch?.[1];
  const text = summary.length > 72 ? `${summary.slice(0, 69)}...` : summary;
  return { id, summary: text };
}

export function parseTasksMarkdown(content: string): TaskProgress {
  const incomplete: TaskItem[] = [];
  const completedItems: TaskItem[] = [];
  let total = 0;
  let completed = 0;

  for (const line of content.split("\n")) {
    const m = line.trim().match(TASK_LINE);
    if (!m) continue;
    total++;
    const item = toTaskItem(m[2].trim());
    if (m[1].toLowerCase() === "x") {
      completed++;
      completedItems.push(item);
    } else {
      incomplete.push(item);
    }
  }

  return { total, completed, incomplete, completedItems };
}

export function loadTaskProgress(
  changeName: string,
  projectRoot?: string
): TaskProgress | null {
  const { specxDir } = getRoots(projectRoot);
  const tasksPath = path.join(getFeatureDir(specxDir, changeName), "tasks.md");
  if (!fs.existsSync(tasksPath)) return null;
  return parseTasksMarkdown(fs.readFileSync(tasksPath, "utf8"));
}

export type ChangeItemExtras = {
  phase?: string;
  spec_status?: string;
  design_status?: string;
  tasks_status?: string;
  tasks_total?: number;
  tasks_completed?: number;
};

export function taskCountsFromItem(
  item: ChangeItemExtras,
  fromFile: TaskProgress | null
): { completed: number; total: number; source: "tasks.md" | "registry" | "none" } {
  if (fromFile && fromFile.total > 0) {
    return {
      completed: fromFile.completed,
      total: fromFile.total,
      source: "tasks.md",
    };
  }
  const total = item.tasks_total;
  const completed = item.tasks_completed;
  if (typeof total === "number" && total > 0) {
    return {
      completed: typeof completed === "number" ? completed : 0,
      total,
      source: "registry",
    };
  }
  return { completed: 0, total: 0, source: "none" };
}

export function formatBuildTasksSection(
  progress: TaskProgress,
  mode: "all" | "single",
  taskId?: string
): string {
  const lines: string[] = [];

  if (mode === "single" && taskId) {
    const match = progress.incomplete.find((t) => t.id === taskId);
    const done = progress.completedItems.find((t) => t.id === taskId);
    const item = match ?? done;
    lines.push(`## Focus task: ${taskId}`);
    if (item) {
      lines.push(`- [ ] ${taskId} ${item.summary}`);
    } else {
      lines.push(`_Task ${taskId} not found in tasks.md_`);
    }
    return lines.join("\n");
  }

  lines.push(
    `## Build scope: ALL open tasks (${progress.incomplete.length} remaining)`
  );
  lines.push(
    "",
    "Implement every unchecked task below in order. Mark each `- [x]` when verified.",
    "Do not stop after one task unless the user explicitly asked for a single task.",
    ""
  );
  for (const t of progress.incomplete) {
    const id = t.id ? `${t.id} ` : "";
    lines.push(`- [ ] ${id}${t.summary}`);
  }
  if (progress.incomplete.length === 0) {
    lines.push("_All tasks complete — run specx verify then specx archive._");
  }
  return lines.join("\n");
}

export function formatTaskBar(completed: number, total: number): string {
  if (total <= 0) return "";
  const pct = Math.round((completed / total) * 100);
  const width = 20;
  const filled = Math.round((completed / total) * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  return `${bar} ${completed}/${total} (${pct}%)`;
}
