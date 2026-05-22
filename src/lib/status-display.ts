import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import type { Registry } from "../../schemas/registry.js";
import { TRACK_FOUNDATION, type SpecxConfig } from "../../schemas/specx-config.js";
import { getPhasesForTrack } from "./config.js";
import { phaseKey } from "./registry.js";
import {
  formatPhaseLabel,
  getDiscoveryPhaseMeta,
} from "./discovery-phases.js";
import {
  formatTaskBar,
  loadTaskProgress,
  taskCountsFromItem,
  type ChangeItemExtras,
} from "./tasks.js";

type PhaseStatus =
  | "pending"
  | "in_progress"
  | "awaiting_approval"
  | "approved"
  | "revision";

function statusColor(status: string): (s: string) => string {
  switch (status) {
    case "approved":
      return chalk.green;
    case "in_progress":
      return chalk.cyan;
    case "awaiting_approval":
      return chalk.yellow;
    case "revision":
      return chalk.magenta;
    default:
      return chalk.dim;
  }
}

function artifactMark(exists: boolean): string {
  return exists ? chalk.green("✓") : chalk.dim("○");
}

export function printDiscoveryStatus(
  config: SpecxConfig,
  registry: Registry,
  specxDir: string
): void {
  const phases = getPhasesForTrack(config.track);
  const discovery = registry.discovery;
  const discoveryExtra = discovery as
    | { status?: string; track?: string }
    | undefined;
  const overall = discoveryExtra?.status;
  const current = discovery?.current_phase;

  const counts: Record<string, number> = {};
  for (const n of phases) {
    const key = phaseKey(n);
    const st = discovery?.phases?.[key]?.status ?? "pending";
    counts[st] = (counts[st] ?? 0) + 1;
  }
  const approved = counts.approved ?? 0;

  console.log(chalk.bold("\nDiscovery"));
  console.log(
    `  Track: ${chalk.cyan(config.track)}${discoveryExtra?.track && discoveryExtra.track !== config.track ? chalk.dim(` (registry: ${discoveryExtra.track})`) : ""}`
  );
  console.log(
    `  Progress: ${chalk.green(String(approved))}/${phases.length} approved` +
      (counts.pending ? chalk.dim(` · ${counts.pending} pending`) : "") +
      (counts.in_progress ? chalk.cyan(` · ${counts.in_progress} in progress`) : "") +
      (counts.awaiting_approval
        ? chalk.yellow(` · ${counts.awaiting_approval} awaiting approval`)
        : "") +
      (counts.revision ? chalk.magenta(` · ${counts.revision} revision`) : "") +
      (overall ? chalk.dim(` · ${overall}`) : "")
  );

  if (current != null) {
    const key = phaseKey(current);
    const curSt = discovery?.phases?.[key]?.status ?? "pending";
    console.log(
      `  Current: ${chalk.bold(formatPhaseLabel(current))} — ${statusColor(curSt)(curSt)}`
    );
  }

  const labelWidth = 42;
  for (const n of phases) {
    const key = phaseKey(n);
    const meta = getDiscoveryPhaseMeta(n);
    const st = (discovery?.phases?.[key]?.status ?? "pending") as PhaseStatus;
    const phaseRec = discovery?.phases?.[key] as
      | { approved_at?: string; assignee?: string }
      | undefined;
    const artifactPath = meta
      ? path.join(specxDir, "discovery", meta.file)
      : "";
    const hasFile = artifactPath ? fs.existsSync(artifactPath) : false;
    const label = formatPhaseLabel(n).padEnd(labelWidth);
    const extras: string[] = [];
    if (phaseRec?.approved_at) extras.push(String(phaseRec.approved_at));
    if (phaseRec?.assignee) extras.push(`@${phaseRec.assignee}`);
    const extraStr = extras.length ? chalk.dim(`  ${extras.join(" · ")}`) : "";
    console.log(
      `  ${artifactMark(hasFile)} ${label} ${statusColor(st)(st)}${extraStr}`
    );
    if (meta) {
      console.log(chalk.dim(`      ${meta.specialist} · ${meta.file}`));
    }
  }
}

export function printFoundationStatus(
  config: SpecxConfig,
  specxDir: string
): void {
  const files = TRACK_FOUNDATION[config.track];
  console.log(chalk.bold("\nFoundation"));
  for (const f of files) {
    const p = path.join(specxDir, "foundation", f);
    const exists = fs.existsSync(p);
    const size = exists ? fs.statSync(p).size : 0;
    const detail =
      exists && size > 80
        ? chalk.dim(` (${Math.round(size / 1024)}k)`)
        : exists
          ? chalk.yellow(" (stub)")
          : "";
    console.log(`  ${artifactMark(exists)} ${f}${detail}`);
  }
}

const CHANGE_FILES = [
  { file: "proposal.md", label: "proposal" },
  { file: "spec.md", label: "spec" },
  { file: "design.md", label: "design" },
  { file: "tasks.md", label: "tasks" },
] as const;

export function printChangesStatus(
  registry: Registry,
  specxDir: string
): void {
  const active = registry.changes?.active;
  const items = registry.changes?.items ?? {};
  const names = Object.keys(items).filter(
    (n) => items[n]?.status !== "archived"
  );

  console.log(chalk.bold("\nChanges"));
  console.log(`  Active: ${active ? chalk.cyan(active) : "—"}`);
  if (names.length === 0) {
    console.log(chalk.dim("  No active changes"));
    return;
  }

  for (const name of names) {
    const item = items[name] as ChangeItemExtras & { status: string };
    printChangeStatus(name, item, name === active, specxDir);
  }
}

function printChangeStatus(
  name: string,
  item: ChangeItemExtras & { status: string },
  isActive: boolean,
  specxDir: string
): void {
  const prefix = isActive ? chalk.cyan("▸ ") : "  ";
  console.log(`\n${prefix}${chalk.bold(name)}`);
  console.log(`    lifecycle: ${statusColor(item.status)(item.status)}`);

  const extras = item as ChangeItemExtras & {
    revision_reason?: string;
    revision_artifact?: string;
    proposal_approved_at?: string;
    spec_approved_at?: string;
    design_approved_at?: string;
  };
  if (extras.phase) console.log(`    build phase: ${extras.phase}`);
  if (extras.revision_reason) {
    console.log(chalk.magenta(`    revision: ${extras.revision_reason}`));
  }
  if (extras.revision_artifact) {
    console.log(chalk.dim(`    revision doc: ${extras.revision_artifact}`));
  }

  const changeDir = path.join(specxDir, "changes", name);
  const artifactParts: string[] = [];
  for (const { file, label } of CHANGE_FILES) {
    const exists = fs.existsSync(path.join(changeDir, file));
    const statusKey = `${label}_status` as keyof ChangeItemExtras;
    const gate = extras[statusKey];
    const gateStr =
      typeof gate === "string" ? ` ${statusColor(gate)(gate)}` : "";
    artifactParts.push(`${artifactMark(exists)} ${label}${gateStr}`);
  }
  console.log(`    artifacts: ${artifactParts.join("  ")}`);

  const fromFile = loadTaskProgress(name);
  const counts = taskCountsFromItem(extras, fromFile);
  if (counts.total > 0) {
    const bar = formatTaskBar(counts.completed, counts.total);
    const src =
      counts.source === "tasks.md"
        ? chalk.dim(" (tasks.md)")
        : chalk.dim(" (registry)");
    console.log(`    tasks: ${bar}${src}`);

    const incomplete = fromFile?.incomplete ?? [];
    const show = isActive ? incomplete.slice(0, 8) : incomplete.slice(0, 3);
    for (const t of show) {
      const summary =
        t.id && t.summary.startsWith(t.id)
          ? t.summary.slice(t.id.length).trim()
          : t.summary;
      const label = t.id ? `${t.id} ` : "";
      console.log(chalk.dim(`      ☐ ${label}${summary}`));
    }
    const remaining = incomplete.length - show.length;
    if (remaining > 0) {
      console.log(chalk.dim(`      … and ${remaining} more open`));
    }

    if (fromFile && fromFile.completedItems.length > 0 && isActive) {
      const recent = fromFile.completedItems.slice(-3);
      console.log(chalk.dim("    recently done:"));
      for (const t of recent) {
        const summary =
          t.id && t.summary.startsWith(t.id)
            ? t.summary.slice(t.id.length).trim()
            : t.summary;
        const label = t.id ? `${t.id} ` : "";
        console.log(chalk.green(`      ✓ ${label}${summary}`));
      }
    }
  } else if (fromFile === null && isActive) {
    console.log(chalk.dim("    tasks: no tasks.md — run specx tasks"));
  }
}
