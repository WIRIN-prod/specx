import { z } from "zod";
import { FeaturePathSchema } from "./features-catalog.js";

export const PhaseStatusSchema = z.enum([
  "pending",
  "in_progress",
  "awaiting_approval",
  "approved",
  "revision",
]);

export const FeatureStatusSchema = z.enum([
  "proposed",
  "spec",
  "design",
  "tasks",
  "building",
  "verifying",
  "review",
  "approved",
  "revision",
  "ready_to_ship",
]);

/** @deprecated Use FeatureStatusSchema — kept for registry migration */
export const ChangeStatusSchema = FeatureStatusSchema;

const PhaseItemSchema = z
  .object({
    status: PhaseStatusSchema,
    assignee: z.string().optional(),
    approved_at: z.string().optional(),
    approvers: z.array(z.string()).optional(),
  })
  .passthrough();

const FeatureItemSchema = z
  .object({
    status: FeatureStatusSchema,
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    review_required: z.boolean().optional(),
    assignees: z.array(z.string()).optional(),
    phase: z.string().optional(),
    feature_status: z.string().optional(),
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
  features: z
    .object({
      active: z.string().nullable().optional(),
      items: z.record(FeaturePathSchema, FeatureItemSchema).optional(),
    })
    .passthrough()
    .optional(),
  /** @deprecated Migrated to features on load */
  changes: z
    .object({
      active: z.string().nullable().optional(),
      items: z.record(z.string(), FeatureItemSchema).optional(),
    })
    .passthrough()
    .optional(),
});

export type Registry = z.infer<typeof RegistrySchema>;

export function normalizeRegistryRaw(raw: unknown): {
  value: unknown;
  changed: boolean;
} {
  if (!raw || typeof raw !== "object") return { value: raw, changed: false };
  const r = { ...(raw as Record<string, unknown>) };
  let changed = false;

  const changes = r.changes as Record<string, unknown> | undefined;
  const features = r.features as Record<string, unknown> | undefined;

  if (changes?.items && !features?.items) {
    r.features = {
      active: changes.active ?? null,
      items: { ...(changes.items as Record<string, unknown>) },
    };
    changed = true;
  }

  const feat = r.features as Record<string, unknown> | undefined;
  if (feat?.items && typeof feat.items === "object") {
    const items = { ...(feat.items as Record<string, unknown>) };
    for (const [name, item] of Object.entries(items)) {
      if (!item || typeof item !== "object") continue;
      const i = { ...(item as Record<string, unknown>) };
      if (typeof i.created_at !== "string") {
        if (typeof i.created === "string") i.created_at = i.created;
        else i.created_at = new Date().toISOString();
        changed = true;
      }
      if (i.status === "ready") {
        i.status = "ready_to_ship";
        changed = true;
      }
      if (i.status === "archived" || i.status === "ready_to_archive") {
        i.status = "approved";
        changed = true;
      }
      items[name] = i;
    }
    r.features = { ...feat, items };
  }

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
    features: {
      active: null,
      items: {},
    },
  };
}
