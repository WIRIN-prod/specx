import fs from "node:fs";
import path from "node:path";
import { getRoots } from "./paths.js";

export interface AuditEvent {
  at: string;
  type: string;
  detail: Record<string, unknown>;
}

/**
 * Appends optional operational events to a local audit log. The Markdown
 * knowledge and work records remain the reviewable project source of truth.
 * Enable this supplementary log by setting SPECX_AUDIT=1.
 */
export function appendAudit(
  type: string,
  detail: Record<string, unknown>,
  projectRoot?: string
): void {
  if (process.env.SPECX_AUDIT !== "1") return;

  const { dotSpecxDir } = getRoots(projectRoot);
  const logPath = path.join(dotSpecxDir, "audit.log");
  const event: AuditEvent = {
    at: new Date().toISOString(),
    type,
    detail,
  };
  fs.mkdirSync(dotSpecxDir, { recursive: true });
  fs.appendFileSync(logPath, JSON.stringify(event) + "\n", "utf8");
}
