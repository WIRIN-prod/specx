import fs from "node:fs";
import path from "node:path";
import { loadConfig } from "./config.js";
import { getRoots } from "./paths.js";

export interface AuditEvent {
  at: string;
  type: string;
  detail: Record<string, unknown>;
}

export function appendAudit(
  type: string,
  detail: Record<string, unknown>,
  projectRoot?: string
): void {
  const config = loadConfig(projectRoot);
  if (!config.evolution?.audit) return;

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
