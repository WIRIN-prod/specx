#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "..", "dist", "cli.js");

if (!existsSync(cliPath)) {
  console.error("specx: run `npm run build` first (dist/cli.js missing)");
  process.exit(1);
}

await import(cliPath);
