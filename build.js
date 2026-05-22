import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync } from "node:fs";
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
  external: [
    "commander",
    "chalk",
    "ora",
    "yaml",
    "zod",
    "fast-glob",
  ],
  sourcemap: true,
});

const templatesDest = join(__dirname, "dist", "templates");
if (existsSync(join(__dirname, "templates"))) {
  mkdirSync(join(__dirname, "dist"), { recursive: true });
  cpSync(join(__dirname, "templates"), templatesDest, { recursive: true });
}

console.log("Built dist/cli.js");
