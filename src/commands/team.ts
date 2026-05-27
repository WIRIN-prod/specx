import chalk from "chalk";
import { loadConfig, saveConfig } from "../lib/config.js";
import { loadRegistry, saveRegistry, patchFeatureItem } from "../lib/registry.js";
import { validateFeatureId } from "../lib/features-catalog.js";

export function runReview(featureId: string): void {
  const id = validateFeatureId(featureId);
  const registry = loadRegistry();
  const item = registry.features?.items?.[id];
  if (!item) {
    console.error(chalk.red(`Feature not found: ${id}`));
    process.exit(1);
  }
  saveRegistry(
    patchFeatureItem(registry, id, {
      review_required: true,
      status: "review",
    })
  );
  console.log(chalk.green(`Feature ${id} flagged for review.`));
}

export function runAssign(phase: string, who: string): void {
  const registry = loadRegistry();
  const key = phase.padStart(2, "0").replace(/^0+/, "").length <= 2
    ? phase.padStart(2, "0")
    : phase;
  const normalized = phase.length <= 2 ? String(parseInt(phase, 10)).padStart(2, "0") : phase;

  saveRegistry({
    ...registry,
    discovery: {
      ...registry.discovery,
      phases: {
        ...registry.discovery?.phases,
        [normalized]: {
          ...registry.discovery?.phases?.[normalized],
          status: registry.discovery?.phases?.[normalized]?.status ?? "pending",
          assignee: who,
        },
      },
    },
  });
  console.log(chalk.green(`Phase ${normalized} assigned to ${who}.`));
}

export function runGate(phase: string, count?: string): void {
  const config = loadConfig();
  const n = count ? parseInt(count, 10) : 2;
  saveConfig({
    ...config,
    gates: {
      ...config.gates,
      discovery: { approvers_required: n },
    },
  });
  console.log(chalk.green(`Gate for phase ${phase}: ${n} approvers required.`));
}
