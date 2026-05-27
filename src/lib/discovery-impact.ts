import fs from "node:fs";
import path from "node:path";
import { getPhasesForTrack } from "./config.js";
import type { SpecxConfig } from "../../schemas/specx-config.js";
import { DISCOVERY_PHASES, formatPhaseLabel } from "./discovery-phases.js";
import { featureBriefPath, getFeatureDir } from "./features.js";
import { getRoots } from "./paths.js";

export interface PhaseImpact {
  phase: number;
  reason: string;
  priority: "required" | "recommended" | "if-applicable";
}

const KEYWORD_RULES: { phases: number[]; patterns: RegExp[]; reason: string }[] = [
  {
    phases: [1, 2],
    patterns: [/problem|market|positioning|competitor|vision/i],
    reason: "Product problem or market positioning may shift",
  },
  {
    phases: [3, 4],
    patterns: [/persona|user type|jtbd|journey|onboarding/i],
    reason: "New or changed users / journeys",
  },
  {
    phases: [5, 6],
    patterns: [/screen|navigation|ia\b|flow|wizard|modal|route/i],
    reason: "Information architecture or interaction flows change",
  },
  {
    phases: [9],
    patterns: [/api|integration|database|stack|architect|performance|scale/i],
    reason: "Technical approach or integrations change",
  },
  {
    phases: [10],
    patterns: [/auth|security|encrypt|pii|password|token|oauth|permission/i],
    reason: "Security / auth surface changes",
  },
  {
    phases: [11],
    patterns: [/compliance|gdpr|hipaa|soc2|audit|retention|legal/i],
    reason: "Compliance or data-retention implications",
  },
];

/** Phases that should be reviewed for every new or materially changed feature */
export function baselinePhaseImpacts(track: SpecxConfig["track"]): PhaseImpact[] {
  const phases = getPhasesForTrack(track);
  const impacts: PhaseImpact[] = [];
  if (phases.includes(7)) {
    impacts.push({
      phase: 7,
      priority: "required",
      reason: "Add/update feature in inventory and MVP boundary",
    });
  }
  if (phases.includes(8)) {
    impacts.push({
      phase: 8,
      priority: "required",
      reason: "Add/update PRD requirements and release criteria",
    });
  }
  if (phases.includes(9)) {
    impacts.push({
      phase: 9,
      priority: "recommended",
      reason: "Confirm technical spec and ADR seeds still hold",
    });
  }
  return impacts;
}

export function analyzeFeatureImpact(
  featurePath: string,
  track: SpecxConfig["track"],
  text?: string
): PhaseImpact[] {
  const content =
    text ??
    (() => {
      const { specxDir } = getRoots();
      const dir = getFeatureDir(specxDir, featurePath);
      let body = "";
      const brief = featureBriefPath(featurePath);
      if (brief) body += fs.readFileSync(brief, "utf8");
      const specPath = path.join(dir, "spec.md");
      if (fs.existsSync(specPath)) {
        body += "\n" + fs.readFileSync(specPath, "utf8");
      }
      return body;
    })();

  const byPhase = new Map<number, PhaseImpact>();

  for (const b of baselinePhaseImpacts(track)) {
    byPhase.set(b.phase, b);
  }

  for (const rule of KEYWORD_RULES) {
    if (!rule.patterns.some((p) => p.test(content))) continue;
    for (const n of rule.phases) {
      if (!getPhasesForTrack(track).includes(n)) continue;
      byPhase.set(n, {
        phase: n,
        priority: "if-applicable",
        reason: rule.reason,
      });
    }
  }

  return [...byPhase.values()].sort((a, b) => a.phase - b.phase);
}

export function formatDiscoveryImpactReport(
  featurePath: string,
  impacts: PhaseImpact[],
  track: SpecxConfig["track"]
): string {
  const lines: string[] = [
    `Discovery maintenance — feature: ${featurePath}`,
    "",
    "Golden truth rule: when a feature changes the product, update discovery",
    "and foundation in the same PR — not only the feature leaf.",
    "",
  ];

  const groups: { key: PhaseImpact["priority"]; label: string }[] = [
    { key: "required", label: "Required updates" },
    { key: "recommended", label: "Recommended" },
    { key: "if-applicable", label: "Review if applicable" },
  ];

  for (const { key, label } of groups) {
    const items = impacts.filter((i) => i.priority === key);
    if (!items.length) continue;
    lines.push(label + ":");
    for (const i of items) {
      const meta = DISCOVERY_PHASES[i.phase];
      lines.push(`  ${formatPhaseLabel(i.phase)} — ${i.reason}`);
      if (meta) lines.push(`    → specx/discovery/${meta.file}`);
    }
    lines.push("");
  }

  lines.push("After editing discovery:");
  lines.push("  1. specx-specialist + specx-critic on changed phases");
  lines.push("  2. specx approve <phase>");
  lines.push("  3. Refresh specx/foundation/STEERING.md, BUILD-ORDER.md, ARCHITECTURE.md");
  lines.push("  4. Git commit discovery + foundation + feature together");
  lines.push("");
  lines.push(`Track: ${track} — see specx/discovery/MAINTENANCE.md`);

  return lines.join("\n");
}
