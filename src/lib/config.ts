import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import {
  SpecxConfigSchema,
  type SpecxConfig,
  TRACK_PHASES,
} from "../../schemas/specx-config.js";
import { getRoots } from "./paths.js";

export function loadConfig(projectRoot?: string): SpecxConfig {
  const { dotSpecxDir } = getRoots(projectRoot);
  const configPath = path.join(dotSpecxDir, "specx.yaml");
  if (!fs.existsSync(configPath)) {
    return SpecxConfigSchema.parse({ track: "standard" });
  }
  const raw = parseYaml(fs.readFileSync(configPath, "utf8"));
  return SpecxConfigSchema.parse(raw);
}

export function saveConfig(
  config: SpecxConfig,
  projectRoot?: string
): void {
  const { dotSpecxDir } = getRoots(projectRoot);
  const configPath = path.join(dotSpecxDir, "specx.yaml");
  fs.mkdirSync(dotSpecxDir, { recursive: true });
  fs.writeFileSync(configPath, stringifyYaml(config), "utf8");
}

export function getPhasesForTrack(track: SpecxConfig["track"]): number[] {
  return TRACK_PHASES[track];
}
