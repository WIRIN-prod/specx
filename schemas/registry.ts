import { z } from "zod";

export const PhaseStatusSchema = z.enum([
  "pending",
  "in_progress",
  "awaiting_approval",
  "approved",
  "revision",
]);

export const ChangeStatusSchema = z.enum([
  "proposed",
  "spec",
  "design",
  "tasks",
  "building",
  "verifying",
  "review",
  "approved",
  "revision",
  "ready_to_archive",
  "archived",
]);

const PhaseItemSchema = z
  .object({
    status: PhaseStatusSchema,
    assignee: z.string().optional(),
    approved_at: z.string().optional(),
    approvers: z.array(z.string()).optional(),
  })
  .passthrough();

const ChangeItemSchema = z
  .object({
    status: ChangeStatusSchema,
    created_at: z.string().optional(),
    review_required: z.boolean().optional(),
    assignees: z.array(z.string()).optional(),
    phase: z.string().optional(),
    spec_status: z.string().optional(),
    design_status: z.string().optional(),
    tasks_status: z.string().optional(),
    tasks_total: z.number().int().nonnegative().optional(),
    tasks_completed: z.number().int().nonnegative().optional(),
  })
  .passthrough();

export const RegistrySchema = z.object({
  version: z.number().default(1),
  discovery: z
    .object({
      current_phase: z.number().int().min(1).max(11).nullable().optional(),
      phases: z.record(z.string(), PhaseItemSchema).optional(),
    })
    .passthrough()
    .optional(),
  changes: z
    .object({
      active: z.string().nullable().optional(),
      items: z.record(z.string(), ChangeItemSchema).optional(),
    })
    .passthrough()
    .optional(),
});

export type Registry = z.infer<typeof RegistrySchema>;

/** Normalize hand-edited or agent-written registry before validation */
export function normalizeRegistryRaw(raw: unknown): {
  value: unknown;
  changed: boolean;
} {
  if (!raw || typeof raw !== "object") return { value: raw, changed: false };
  const r = { ...(raw as Record<string, unknown>) };
  const changes = r.changes as Record<string, unknown> | undefined;
  if (!changes?.items || typeof changes.items !== "object") {
    return { value: r, changed: false };
  }

  let changed = false;
  const items = { ...(changes.items as Record<string, unknown>) };
  for (const [name, item] of Object.entries(items)) {
    if (!item || typeof item !== "object") continue;
    const i = { ...(item as Record<string, unknown>) };
    if (typeof i.created_at !== "string") {
      if (typeof i.created === "string") {
        i.created_at = i.created;
      } else {
        i.created_at = new Date().toISOString();
      }
      changed = true;
    }
    if (i.status === "ready") {
      i.status = "ready_to_archive";
      changed = true;
    }
    items[name] = i;
  }
  r.changes = { ...changes, items };
  return { value: r, changed };
}

export function defaultRegistry(phases: number[]): Registry {
  const phaseRecords: Registry["discovery"] extends { phases?: infer P }
    ? P
    : never = {} as Registry["discovery"] extends { phases?: infer P }
    ? P
    : never;

  for (const n of phases) {
    const key = String(n).padStart(2, "0");
    (phaseRecords as Record<string, { status: "pending" }>)[key] = {
      status: "pending",
    };
  }

  return {
    version: 1,
    discovery: {
      current_phase: phases[0] ?? null,
      phases: phaseRecords as Registry["discovery"] extends { phases?: infer P }
        ? P
        : undefined,
    },
    changes: {
      active: null,
      items: {},
    },
  };
}
