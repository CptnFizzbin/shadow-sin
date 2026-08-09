/**
 * Keys for all attributes in Shadowrun 4e, plus the four Matrix stats
 * (Firewall/Response/Signal/System) that substitute for attributes in Matrix Tests — see
 * `MatrixAttrs` in CONTEXT.md. A Runner only ever populates the original twelve; the Matrix
 * stats exist on this enum so `MatrixNode`s and other Matrix-capable Entities can reuse the same
 * key space, dice-pool machinery, and `GameEffect` targeting.
 */
export enum AttributeKey {
  body = "body",
  agility = "agility",
  reaction = "reaction",
  strength = "strength",
  charisma = "charisma",
  intuition = "intuition",
  logic = "logic",
  willpower = "willpower",
  edge = "edge",
  essence = "essence",
  magic = "magic",
  resonance = "resonance",
  firewall = "firewall",
  response = "response",
  signal = "signal",
  system = "system",
}

/**
 * Short display labels for each attribute.
 */
export const AttributeLabels: Record<AttributeKey, string> = {

  body: "BOD",
  agility: "AGI",
  reaction: "REA",
  strength: "STR",
  charisma: "CHA",
  intuition: "INT",
  logic: "LOG",
  willpower: "WIL",
  magic: "MAG",
  resonance: "RES",
  edge: "EDG",
  essence: "ESS",
  firewall: "FWL",
  response: "RSP",
  signal: "SIG",
  system: "SYS",
}

// Runner-attribute display order — deliberately excludes the four Matrix stats below, which
// aren't Runner attributes and never appear in the Builder/Viewer attribute rows (see #438).
export const AttributeOrder: AttributeKey[] = [
  AttributeKey.body,
  AttributeKey.agility,
  AttributeKey.reaction,
  AttributeKey.strength,
  AttributeKey.charisma,
  AttributeKey.intuition,
  AttributeKey.logic,
  AttributeKey.willpower,
  AttributeKey.edge,
  AttributeKey.essence,
  AttributeKey.magic,
  AttributeKey.resonance,
]

/**
 * List of physical attributes.
 */
export const PhysicalAttributes: AttributeKey[] = [
  AttributeKey.body,
  AttributeKey.agility,
  AttributeKey.reaction,
  AttributeKey.strength,
] as const

/**
 * List of mental attributes.
 */
export const MentalAttributes: AttributeKey[] = [
  AttributeKey.charisma,
  AttributeKey.intuition,
  AttributeKey.logic,
  AttributeKey.willpower,
] as const

/**
 * List of special attributes.
 */
export const SpecialAttributes: AttributeKey[] = [
  AttributeKey.magic,
  AttributeKey.resonance,
  AttributeKey.edge,
  AttributeKey.essence,
] as const
