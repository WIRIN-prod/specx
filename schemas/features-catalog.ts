import { z } from "zod";

/** Path under specx/ e.g. auth/email/registration (leaf folder) */
export const FeaturePathSchema = z
  .string()
  .min(1)
  .refine(
    (p) => {
      try {
        const segments = p.split("/").filter(Boolean);
        if (!segments.length) return false;
        const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
        const GROUP = /^\([a-z][a-z0-9]*(-[a-z0-9]+)*\)$/;
        const DYNAMIC =
          /^\[[a-z][a-z0-9]*(-[a-z0-9]+)*\]$|^\[\.\.\.[a-z][a-z0-9]*(-[a-z0-9]+)*\]$|^\[\[\.\.\.[a-z][a-z0-9]*(-[a-z0-9]+)*\]\]$/;
        return segments.every((s) => {
          if (s.startsWith("_")) return false;
          return KEBAB.test(s) || GROUP.test(s) || DYNAMIC.test(s);
        });
      } catch {
        return false;
      }
    },
    { message: "Invalid feature path (use auth/email/registration)" }
  );

/** @deprecated alias */
export const FeatureIdSchema = FeaturePathSchema;

export const FeatureCatalogEntrySchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    /** Logical path segments for display (defaults to catalog key) */
    path: z.string().optional(),
    depends_on: z.array(FeaturePathSchema).default([]),
  })
  .passthrough();

export const FeaturesCatalogSchema = z.object({
  version: z.number().default(1),
  features: z.record(FeaturePathSchema, FeatureCatalogEntrySchema).default({}),
});

export type FeaturesCatalog = z.infer<typeof FeaturesCatalogSchema>;

export function defaultFeaturesCatalog(): FeaturesCatalog {
  return { version: 1, features: {} };
}
