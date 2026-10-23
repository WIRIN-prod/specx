import { z } from "zod";

export const SpecxConfigSchema = z.object({
  project: z.object({ name: z.string().optional(), stack: z.string().optional() }).default({}),
});
export type SpecxConfig = z.infer<typeof SpecxConfigSchema>;
