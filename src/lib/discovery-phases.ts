export interface DiscoveryPhaseMeta {
  num: number;
  file: string;
  title: string;
  specialist: string;
}

export const DISCOVERY_PHASES: Record<number, DiscoveryPhaseMeta> = {
  1: {
    num: 1,
    file: "01-problem-statement.md",
    title: "Problem definition",
    specialist: "Product Strategist",
  },
  2: {
    num: 2,
    file: "02-market-research.md",
    title: "Market + competitor research",
    specialist: "Market Researcher",
  },
  3: {
    num: 3,
    file: "03-personas.md",
    title: "Personas + Jobs To Be Done",
    specialist: "UX Researcher",
  },
  4: {
    num: 4,
    file: "04-user-journeys.md",
    title: "User journeys + edge cases",
    specialist: "Service Designer",
  },
  5: {
    num: 5,
    file: "05-information-architecture.md",
    title: "Information architecture",
    specialist: "Information Architect",
  },
  6: {
    num: 6,
    file: "06-user-flows.md",
    title: "User flows + decision trees",
    specialist: "Interaction Designer",
  },
  7: {
    num: 7,
    file: "07-feature-inventory.md",
    title: "Feature inventory + MVP boundary",
    specialist: "Product Manager (MVP)",
  },
  8: {
    num: 8,
    file: "08-prd.md",
    title: "PRD",
    specialist: "Product Manager (PRD)",
  },
  9: {
    num: 9,
    file: "09-technical-spec.md",
    title: "Technical spec",
    specialist: "Solution Architect",
  },
  10: {
    num: 10,
    file: "10-security.md",
    title: "Security",
    specialist: "Security Architect",
  },
  11: {
    num: 11,
    file: "11-compliance.md",
    title: "Compliance",
    specialist: "Compliance Officer",
  },
};

export function discoveryPhaseKey(n: number): string {
  return String(n).padStart(2, "0");
}

export function getDiscoveryPhaseMeta(n: number): DiscoveryPhaseMeta | undefined {
  return DISCOVERY_PHASES[n];
}

export function phaseFile(n: number): string {
  return DISCOVERY_PHASES[n]?.file ?? `${String(n).padStart(2, "0")}.md`;
}

export function formatPhaseLabel(n: number): string {
  const meta = getDiscoveryPhaseMeta(n);
  const key = discoveryPhaseKey(n);
  return meta ? `${key} ${meta.title}` : `${key} Phase ${n}`;
}
