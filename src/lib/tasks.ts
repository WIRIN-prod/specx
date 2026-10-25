import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export const TASK_STATUSES = ["draft", "todo", "in-progress", "blocked", "in-review", "done", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  specs: string[];
  depends_on: string[];
  decisions: string[];
  files: string[];
  model?: string;
  pr?: string;
  file: string;
}

export interface Board {
  tasks: Task[];
  decisions: Map<string, string>;
  problems: string[];
}

const TASK_INDEX = "TASKS.md";
const BEGIN = "<!-- specx:tasks:begin -->";
const END = "<!-- specx:tasks:end -->";

export function readFrontmatter(file: string): Record<string, unknown> | undefined {
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return undefined;
  const data = parseYaml(match[1]);
  return data && typeof data === "object" ? data as Record<string, unknown> : undefined;
}

function list(value: unknown): string[] {
  if (value === undefined || value === null || value === "") return [];
  return (Array.isArray(value) ? value : [value]).map(String);
}

function markdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith(".md") && name !== TASK_INDEX && name !== "README.md").map((name) => path.join(dir, name));
}

export function loadBoard(specxDir: string): Board {
  const problems: string[] = [];
  const decisions = new Map<string, string>();
  for (const file of markdownFiles(path.join(specxDir, "decisions"))) {
    const data = readFrontmatter(file);
    if (data?.id) decisions.set(String(data.id), String(data.status ?? "open"));
  }

  const tasks: Task[] = [];
  for (const file of markdownFiles(path.join(specxDir, "tasks"))) {
    const rel = path.basename(file);
    let data: Record<string, unknown> | undefined;
    try { data = readFrontmatter(file); }
    catch (err) { problems.push(`${rel}: invalid frontmatter (${(err as Error).message.split("\n")[0]})`); continue; }
    if (!data?.id) { problems.push(`${rel}: missing frontmatter id`); continue; }
    const status = String(data.status ?? "draft") as TaskStatus;
    if (!TASK_STATUSES.includes(status)) problems.push(`${data.id}: unknown status "${status}"`);
    tasks.push({
      id: String(data.id),
      title: String(data.title ?? ""),
      status,
      specs: list(data.specs),
      depends_on: list(data.depends_on),
      decisions: list(data.decisions),
      files: list(data.files),
      model: data.model ? String(data.model) : undefined,
      pr: data.pr ? String(data.pr) : undefined,
      file,
    });
  }
  tasks.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  const ids = new Set<string>();
  for (const task of tasks) {
    if (ids.has(task.id)) problems.push(`${task.id}: duplicate task id`);
    ids.add(task.id);
  }
  for (const task of tasks) {
    for (const dep of task.depends_on) if (!ids.has(dep)) problems.push(`${task.id}: depends on unknown task ${dep}`);
    for (const dec of task.decisions) if (!decisions.has(dec)) problems.push(`${task.id}: references unknown decision ${dec}`);
  }
  const cycle = findCycle(tasks);
  if (cycle) problems.push(`dependency cycle: ${cycle.join(" -> ")}`);
  return { tasks, decisions, problems };
}

function findCycle(tasks: Task[]): string[] | undefined {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const state = new Map<string, "visiting" | "done">();
  const stack: string[] = [];
  const visit = (id: string): string[] | undefined => {
    if (state.get(id) === "done") return undefined;
    if (state.get(id) === "visiting") return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, "visiting");
    stack.push(id);
    for (const dep of byId.get(id)?.depends_on ?? []) {
      if (!byId.has(dep)) continue;
      const found = visit(dep);
      if (found) return found;
    }
    stack.pop();
    state.set(id, "done");
    return undefined;
  };
  for (const task of tasks) {
    const found = visit(task.id);
    if (found) return found;
  }
  return undefined;
}

/** Tasks the user can approve for execution: todo, every dependency done, every decision answered. */
export function readyTasks(board: Board): Task[] {
  const status = new Map(board.tasks.map((task) => [task.id, task.status]));
  return board.tasks.filter((task) =>
    task.status === "todo"
    && task.depends_on.every((dep) => status.get(dep) === "done")
    && task.decisions.every((dec) => board.decisions.get(dec) === "answered"));
}

function normalizeScope(scope: string): string {
  return scope.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/?\*.*$/, "").replace(/\/$/, "");
}

/** True when two tasks could touch the same file. A task without declared files overlaps everything. */
export function filesOverlap(a: Task, b: Task): boolean {
  if (!a.files.length || !b.files.length) return true;
  return a.files.some((x) => b.files.some((y) => {
    const p = normalizeScope(x);
    const q = normalizeScope(y);
    return p === "" || q === "" || p === q || p.startsWith(`${q}/`) || q.startsWith(`${p}/`);
  }));
}

/** Groups ready tasks so that no two tasks in a group share files; each group can run in parallel. */
export function parallelGroups(tasks: Task[]): Task[][] {
  const groups: Task[][] = [];
  for (const task of tasks) {
    const group = groups.find((members) => members.every((other) => !filesOverlap(task, other)));
    if (group) group.push(task);
    else groups.push([task]);
  }
  return groups;
}

/**
 * Tasks that must pause with the given task: everything that depends on it, its unfinished
 * dependencies, and unfinished tasks sharing one of its specs or decisions.
 */
export function relatedTasks(board: Board, id: string): Task[] {
  const target = board.tasks.find((task) => task.id === id);
  if (!target) throw new Error(`Unknown task: ${id}`);
  const open = (task: Task) => task.status !== "done" && task.status !== "cancelled";
  const related = new Set<string>();
  const walk = (start: string, next: (task: Task) => string[]) => {
    const queue = [start];
    while (queue.length) {
      const currentId = queue.shift();
      const current = board.tasks.find((task) => task.id === currentId);
      for (const nid of current ? next(current) : []) {
        if (nid === id || related.has(nid)) continue;
        related.add(nid);
        queue.push(nid);
      }
    }
  };
  walk(id, (task) => board.tasks.filter((other) => other.depends_on.includes(task.id)).map((other) => other.id));
  walk(id, (task) => task.depends_on.filter((dep) => {
    const t = board.tasks.find((other) => other.id === dep);
    return t !== undefined && open(t);
  }));
  for (const task of board.tasks) {
    if (task.id === id) continue;
    if (task.specs.some((spec) => target.specs.includes(spec)) || task.decisions.some((dec) => target.decisions.includes(dec))) related.add(task.id);
  }
  return board.tasks.filter((task) => related.has(task.id) && open(task));
}

export function renderTaskTable(board: Board): string {
  const cell = (value: string) => value.replace(/\|/g, "\\|") || "—";
  const rows = board.tasks.map((task) => {
    const link = `[${task.id}](${path.basename(task.file)})`;
    return `| ${link} | ${cell(task.title)} | ${task.status} | ${cell(task.depends_on.join(", "))} | ${cell(task.decisions.join(", "))} | ${cell(task.model ?? "")} | ${cell(task.pr ?? "")} |`;
  });
  return ["| ID | Title | Status | Depends on | Decisions | Model | PR |", "|---|---|---|---|---|---|---|", ...rows].join("\n");
}

/** Rewrites the managed table in TASKS.md from the task files. */
export function writeTaskIndex(specxDir: string, board: Board): string {
  const file = path.join(specxDir, "tasks", TASK_INDEX);
  const section = `${BEGIN}\n${renderTaskTable(board)}\n${END}`;
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "# Tasks\n";
  const start = existing.indexOf(BEGIN);
  const finish = start < 0 ? -1 : existing.indexOf(END, start);
  const next = start >= 0 && finish >= 0
    ? `${existing.slice(0, start)}${section}${existing.slice(finish + END.length)}`
    : `${existing.trimEnd()}\n\n${section}\n`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next, "utf8");
  return file;
}
