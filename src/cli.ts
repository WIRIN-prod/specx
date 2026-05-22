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
discover.action(runDiscover);

program.command("phase <n>").description("Scaffold discovery phase").action((n) => runPhase(parseInt(n, 10)));

program
  .command("approve [target]")
  .description(
    "Approve discovery phase, change artifact (proposal|spec|design|tasks), or whole change"
  )
  .option("--change <name>", "Change name (default: active)")
  .action((target, opts) => runApprove(target, { change: opts.change }));

program
  .command("revise [target]")
  .description("Mark discovery phase or change artifact for revision")
  .option("--change <name>", "Change name (default: active)")
  .option("-m, --message <reason>", "Revision reason")
  .action((target, opts) =>
    runRevise(target, { change: opts.change, message: opts.message })
  );

program
  .command("propose <name>")
  .description("Create a new change")
  .option("-m, --message <msg>", "proposal summary")
  .action((name, opts) => runPropose(name, opts.message));

program.command("spec [change]").description("Scaffold change spec").action(runSpec);
program.command("design [change]").description("Scaffold change design").action(runDesign);
program.command("tasks [change]").description("Scaffold change tasks").action(runTasks);

program
  .command("build [change]")
  .description("Print build brief — all open tasks by default")
  .option("--task <id>", "Single task only (e.g. 1.2)")
  .option("--one", "Same as --task: build one task only")
  .action((change, opts) =>
    runBuild(change, { task: opts.task, one: opts.one })
  );

program.command("verify [change]").description("Verifier checklist").action(runVerify);
program.command("archive <change>").description("Archive change and merge specs").action(runArchive);
program.command("diff [change]").description("Show delta summary").action(runDiff);

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
