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
  "ready_to_archive",
  "archived",
]);

export const RegistrySchema = z.object({
  version: z.number().default(1),
  discovery: z
    .object({
      current_phase: z.number().int().min(1).max(11).nullable().optional(),
      phases: z
        .record(
          z.string(),
          z.object({
            status: PhaseStatusSchema,
            assignee: z.string().optional(),
            approved_at: z.string().optional(),
            approvers: z.array(z.string()).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  changes: z
    .object({
      active: z.string().nullable().optional(),
      items: z
        .record(
          z.string(),
          z.object({
            status: ChangeStatusSchema,
            created_at: z.string(),
            review_required: z.boolean().optional(),
            assignees: z.array(z.string()).optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export type Registry = z.infer<typeof RegistrySchema>;

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
