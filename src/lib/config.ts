import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { SpecxConfigSchema, type SpecxConfig } from "../../schemas/specx-config.js";
import { getRoots } from "./paths.js";

export function loadConfig(projectRoot?: string): SpecxConfig {
  const { dotSpecxDir } = getRoots(projectRoot);
  const configPath = path.join(dotSpecxDir, "specx.yaml");
  if (!fs.existsSync(configPath)) {
    return SpecxConfigSchema.parse({});
  }
  return SpecxConfigSchema.parse(parseYaml(fs.readFileSync(configPath, "utf8")));
}

export function saveConfig(config: SpecxConfig, projectRoot?: string): void {
  const { dotSpecxDir } = getRoots(projectRoot);
  fs.mkdirSync(dotSpecxDir, { recursive: true });
  fs.writeFileSync(
    path.join(dotSpecxDir, "specx.yaml"),
    stringifyYaml(config),
    "utf8"
  );
}
