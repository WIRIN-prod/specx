import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: ["src/cli.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "dist/cli.js",
  external: ["commander", "chalk", "ora", "yaml", "zod"],
  sourcemap: true,
});

const templatesSource = join(__dirname, "templates");
const templatesDest = join(__dirname, "dist", "templates");
if (existsSync(templatesSource)) {
  mkdirSync(join(__dirname, "dist"), { recursive: true });
  rmSync(templatesDest, { recursive: true, force: true });
  cpSync(templatesSource, templatesDest, { recursive: true });
}

console.log("Built dist/cli.js");
