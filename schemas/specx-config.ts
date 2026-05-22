import { z } from "zod";

export const TrackSchema = z.enum(["quick", "standard", "enterprise"]);

export const SpecxConfigSchema = z.object({
  track: TrackSchema.default("standard"),
  project: z
    .object({
      name: z.string().optional(),
      stack: z.string().optional(),
    })
    .optional(),
  gates: z
    .object({
      discovery: z
        .object({
          approvers_required: z.number().int().min(1).default(1),
        })
        .optional(),
      build: z
        .object({
          review_before_archive: z.boolean().default(false),
          approvers_required: z.number().int().min(1).default(1),
        })
        .optional(),
    })
    .optional(),
  models: z
    .object({
      specialist: z.string().nullable().optional(),
      critic: z.string().nullable().optional(),
    })
    .optional(),
  evolution: z
    .object({
      drift_schedule: z.enum(["manual", "weekly"]).default("manual"),
      audit: z.boolean().default(false),
    })
    .optional(),
  team: z
    .object({
      rbac_enabled: z.boolean().default(false),
    })
    .optional(),
});

export type SpecxConfig = z.infer<typeof SpecxConfigSchema>;

export const TRACK_PHASES: Record<
  z.infer<typeof TrackSchema>,
  number[]
> = {
  quick: [7, 8, 9],
  standard: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  enterprise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export const TRACK_FOUNDATION: Record<
  z.infer<typeof TrackSchema>,
  string[]
> = {
  quick: ["RULES.md", "BUILD-ORDER.md"],
  standard: ["STEERING.md", "ARCHITECTURE.md", "RULES.md", "BUILD-ORDER.md"],
  enterprise: [
    "STEERING.md",
    "ARCHITECTURE.md",
    "RULES.md",
    "BUILD-ORDER.md",
  ],
};
