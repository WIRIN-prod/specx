#!/usr/bin/env node
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "..", "dist", "cli.js");

if (!existsSync(cliPath)) {
  console.error("specx: run `npm run build` first (dist/cli.js missing)");
  process.exit(1);
}

// Must be a file:// URL - a bare Windows path is rejected by the ESM loader.
await import(pathToFileURL(cliPath).href);
