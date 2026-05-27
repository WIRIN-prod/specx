#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { runInit } from "./commands/init.js";
import {
  runStatus,
  runConfig,
  runTrack,
  runOnboard,
  runUpdate,
  runRun,
} from "./commands/core.js";
import {
  runDiscover,
  runDiscoverQuick,
  runDiscoverResume,
  runDiscoverImpact,
  runPhase,
} from "./commands/discovery.js";
import { runApprove, runRevise } from "./commands/gates.js";
import {
  runPropose,
  runSpec,
  runDesign,
  runTasks,
  runBuild,
  runVerify,
  runArchive,
  runDiff,
} from "./commands/build.js";
import { runDrift, runHealth, runChangelog, runRetro } from "./commands/evolution.js";
import { runReview, runAssign, runGate } from "./commands/team.js";
import {
  runFeatureList,
  runFeatureUse,
  runFeatureGraph,
  runFeatureStructure,
} from "./commands/features.js";
import { runDepAdd, runDepRemove, runDepList } from "./commands/deps.js";
import {
  runMigrate,
  runMigrateMapTemplate,
  parseMigrateMapPairs,
} from "./commands/migrate.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(here, here.endsWith("dist") ? ".." : "../..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const program = new Command();

program
  .name("specx")
  .description("Self-sufficient spec-driven framework")
  .version(pkg.version);

program
  .command("init")
  .description("Initialize specX in a project")
  .argument("[path]", "project directory", ".")
  .option("--track <track>", "quick | standard | enterprise", "enterprise")
  .action(async (p, opts) => {
    await runInit(p, opts.track as "quick" | "standard" | "enterprise");
  });

program.command("update").description("Refresh agent integrations").action(runUpdate);

program.command("status").description("Show registry state").action(runStatus);

program
  .command("config")
  .description("Show or edit specx.yaml")
  .option("--edit", "Open in $EDITOR")
  .action((opts) => runConfig(!!opts.edit));

program
  .command("track <name>")
  .description("Set quick | standard | enterprise track")
  .action(runTrack);

program.command("onboard").description("Print agent context bundle").action(runOnboard);

const discover = program.command("discover").description("Discovery layer");

discover.command("quick").description("Quick track phases 07-09").action(runDiscoverQuick);
discover.command("resume").description("Resume discovery").action(runDiscoverResume);
discover
  .command("impact [feature]")
  .description("Which discovery phases to update for a feature (living golden truth)")
  .action((feature) => runDiscoverImpact(feature));
discover.action(runDiscover);

program.command("phase <n>").description("Scaffold discovery phase").action((n) => runPhase(parseInt(n, 10)));

program
  .command("approve [target]")
  .description(
    "Approve discovery phase or feature artifact (feature|spec|design|tasks)"
  )
  .option("--feature <id>", "Feature id (default: active)")
  .option("--change <id>", "Alias for --feature")
  .action((target, opts) =>
    runApprove(target, { feature: opts.feature, change: opts.change })
  );

program
  .command("revise [target]")
  .description("Mark discovery phase or feature artifact for revision")
  .option("--feature <id>", "Feature id (default: active)")
  .option("--change <id>", "Alias for --feature")
  .option("-m, --message <reason>", "Revision reason")
  .action((target, opts) =>
    runRevise(target, {
      feature: opts.feature,
      change: opts.change,
      message: opts.message,
    })
  );

const feature = program.command("feature").description("Feature catalog (golden truth)");

feature.command("list", { isDefault: true }).description("List all features").action(runFeatureList);
feature.command("use <id>").description("Set active feature").action(runFeatureUse);
feature.command("graph").description("Show dependency graph").action(runFeatureGraph);
feature
  .command("structure")
  .description("Print segment naming conventions (Next.js-style)")
  .action(runFeatureStructure);

const dep = program.command("dep").alias("deps").description("Feature dependencies (M→M)");

dep.command("add <from> <to>").description("from depends on to").action(runDepAdd);
dep.command("remove <from> <to>").description("Remove dependency edge").action(runDepRemove);
dep.command("list", { isDefault: true }).description("Show dependency graph").action(runDepList);

const migrate = program
  .command("migrate")
  .description("Move legacy specx/changes/ (and specx/features/) into segmented feature tree");

migrate
  .option("--dry-run", "Print planned moves without writing")
  .option("--keep-legacy", "Copy instead of move (keep specx/changes/)")
  .option(
    "--map <pair>",
    "Map legacy folder name to path (repeatable), e.g. --map slice-1:resumex/slice-1",
    (val: string, prev: string[]) => [...(prev ?? []), val],
    [] as string[]
  )
  .action((opts) =>
    runMigrate({
      dryRun: opts.dryRun,
      keepLegacyDirs: opts.keepLegacy,
      map: parseMigrateMapPairs(opts.map as string[] | undefined),
    })
  );

migrate
  .command("map")
  .description("Write .specx/migrate-map.yaml from current specx/changes/ folders")
  .action(runMigrateMapTemplate);

program
  .command("propose <id>")
  .description("Create or open a segmented feature (e.g. auth/email/registration)")
  .option("-m, --message <msg>", "FEATURE.md summary")
  .action((name, opts) => runPropose(name, opts.message));

program.command("spec [feature]").description("Scaffold feature spec").action(runSpec);
program.command("design [feature]").description("Scaffold feature design").action(runDesign);
program.command("tasks [feature]").description("Scaffold feature tasks").action(runTasks);

program
  .command("build [feature]")
  .description("Print build brief — all open tasks by default")
  .option("--task <id>", "Single task only (e.g. 1.2)")
  .option("--one", "Same as --task: build one task only")
  .action((change, opts) =>
    runBuild(change, { task: opts.task, one: opts.one })
  );

program.command("verify [change]").description("Verifier checklist").action(runVerify);
program
  .command("archive [feature]")
  .description("(Deprecated) Features are persistent — no archive")
  .action(runArchive);
program.command("diff [feature]").description("Show capability spec deltas").action(runDiff);

program.command("drift").description("Generate drift report").action(runDrift);
program.command("health").description("Generate spec health report").action(runHealth);
program.command("changelog").description("Regenerate changelog").action(runChangelog);
program.command("retro <change>").description("Scaffold retrospective").action(runRetro);

program.command("review <change>").description("Flag change for review").action(runReview);
program.command("assign <phase> <who>").description("Assign discovery phase").action(runAssign);
program
  .command("gate <phase>")
  .argument("[count]", "approvers required", "2")
  .description("Set gate approvers")
  .action((phase, count) => runGate(phase, count));

program
  .command("run")
  .description("Headless agent scaffold")
  .option("-p, --prompt <text>", "Print prompt bundle")
  .option("--phase <n>", "Discovery phase")
  .option("--input <text>", "Input text")
  .option("--propose <name>", "Create change")
  .option("--auto-approve", "Skip gate hints")
  .action((opts) =>
    runRun({
      prompt: opts.prompt,
      phase: opts.phase,
      input: opts.input,
      propose: opts.propose,
      autoApprove: opts.autoApprove,
    })
  );

program.parse();
