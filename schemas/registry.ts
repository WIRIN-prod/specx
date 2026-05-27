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

/** Legacy discovery phase status → current enum */
const PHASE_STATUS_ALIASES: Record<string, z.infer<typeof PhaseStatusSchema>> = {
  awaiting_human: "awaiting_approval",
  awaiting_gate: "awaiting_approval",
  awaiting_review: "awaiting_approval",
  in_review: "awaiting_approval",
  blocked: "awaiting_approval",
  draft: "in_progress",
  complete: "approved",
  done: "approved",
};

/** Legacy feature status → current enum */
const FEATURE_STATUS_ALIASES: Record<string, z.infer<typeof FeatureStatusSchema>> = {
  draft: "proposed",
  ready: "ready_to_ship",
  archived: "approved",
  ready_to_archive: "approved",
};

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
      if (typeof i.status === "string") {
        const mapped = FEATURE_STATUS_ALIASES[i.status];
        if (mapped) {
          i.status = mapped;
          changed = true;
        }
      }
      items[name] = i;
    }
    r.features = { ...feat, items };
  }

  const discovery = r.discovery as Record<string, unknown> | undefined;
  if (discovery?.phases && typeof discovery.phases === "object") {
    const phases = { ...(discovery.phases as Record<string, unknown>) };
    for (const [key, phase] of Object.entries(phases)) {
      if (!phase || typeof phase !== "object") continue;
      const p = { ...(phase as Record<string, unknown>) };
      if (typeof p.status === "string") {
        const mapped = PHASE_STATUS_ALIASES[p.status];
        if (mapped) {
          p.status = mapped;
          changed = true;
        }
      }
      phases[key] = p;
    }
    r.discovery = { ...discovery, phases };
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
