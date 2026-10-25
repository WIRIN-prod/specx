import { z } from "zod";

export const AGENT_HOSTS = ["codex", "claude", "cursor", "copilot"] as const;
export const AgentHostSchema = z.enum(AGENT_HOSTS);
export type AgentHost = z.infer<typeof AgentHostSchema>;

export const SpecxConfigSchema = z.object({
  project: z.object({ name: z.string().optional(), stack: z.string().optional() }).passthrough().default({}),
  integrations: z.object({ agents: z.array(AgentHostSchema).min(1) }).optional(),
  // Answered by the user on the first /specx:execute run.
  git: z.object({ main_branch: z.string().optional(), worktree_root: z.string().optional() }).passthrough().optional(),
}).passthrough();
export type SpecxConfig = z.infer<typeof SpecxConfigSchema>;
