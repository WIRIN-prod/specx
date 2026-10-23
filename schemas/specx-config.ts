import { z } from "zod";

export const AGENT_HOSTS = ["codex", "claude", "cursor", "copilot"] as const;
export const AgentHostSchema = z.enum(AGENT_HOSTS);
export type AgentHost = z.infer<typeof AgentHostSchema>;

export const SpecxConfigSchema = z.object({
  project: z.object({ name: z.string().optional(), stack: z.string().optional() }).default({}),
  integrations: z.object({ agents: z.array(AgentHostSchema).min(1) }).optional(),
});
export type SpecxConfig = z.infer<typeof SpecxConfigSchema>;
