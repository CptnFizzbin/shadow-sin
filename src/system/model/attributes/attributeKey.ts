/**
 * Keys for all attributes in Shadowrun 4e
 */
export enum AttrKey {
  // Physical
  body = "body",
  agility = "agility",
  reaction = "reaction",
  strength = "strength",

  // Mental
  charisma = "charisma",
  intuition = "intuition",
  logic = "logic",
  willpower = "willpower",

  // Special
  edge = "edge",
  essence = "essence",
  magic = "magic",
  resonance = "resonance",

  // Matrix
  pilot = "pilot",
  firewall = "firewall",
  response = "response",
  signal = "signal",
  system = "system",

  /**
   * AI-only, computed. Unrelated to the generic `EntityData.rating?: number` used by
   * Licenses/SINs/etc — same name, different concept (see CONTEXT.md's **Rating** entry). Never
   * stored on `RunnerData.attributes`; always derived by `AiAttrFormulas.getRating` from the AI's
   * own Mental attributes.
   */
  rating = "rating",

  // Vehicle
  armor = "armor",
  handling = "handling",
  sensors = "sensors",
}

export const AttributeKey = AttrKey
export type AttributeKey = AttrKey

/**
 * Short display labels for each attribute.
 */
export const AttributeLabels: Record<AttrKey, string> = {
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

  pilot: "PIL",
  firewall: "FWL",
  response: "RSP",
  signal: "SIG",
  system: "SYS",

  armor: "ARM",
  handling: "HDL",
  sensors: "SEN",

  rating: "RTG",
}

// Deliberately does NOT include AiAttributes (Rating/System/Firewall/Response/Signal) — this
// list is consumed by several components that assume it's exactly the 12 core Runner attributes
// (e.g. the always-visible header summary, the Initiative Tracker's Combatant form), not just
// AttrSelectors.selectActive. AI-only rows are added on top of this list only where a consumer is
// actually AI-aware — see AiAttributes below.
export const AttributeOrder: AttrKey[] = [
  AttrKey.body,
  AttrKey.agility,
  AttrKey.reaction,
  AttrKey.strength,
  AttrKey.charisma,
  AttrKey.intuition,
  AttrKey.logic,
  AttrKey.willpower,
  AttrKey.edge,
  AttrKey.essence,
  AttrKey.magic,
  AttrKey.resonance,
]

/**
 * List of physical attributes.
 */
export const PhysicalAttributes: AttrKey[] = [
  AttrKey.body,
  AttrKey.agility,
  AttrKey.reaction,
  AttrKey.strength,
] as const

/**
 * List of mental attributes.
 */
export const MentalAttributes: AttrKey[] = [
  AttrKey.charisma,
  AttrKey.intuition,
  AttrKey.logic,
  AttrKey.willpower,
] as const

/**
 * List of special attributes.
 */
export const SpecialAttributes: AttrKey[] = [
  AttrKey.magic,
  AttrKey.resonance,
  AttrKey.edge,
  AttrKey.essence,
] as const

/**
 * List of matrix attributes.
 */
export const MatrixAttributes: AttrKey[] = [
  AttrKey.firewall,
  AttrKey.response,
  AttrKey.signal,
  AttrKey.system,
] as const

/**
 * AI-only attribute rows: Rating plus the four Matrix attributes, in RAW's own presentation
 * order. Always computed (see `AiAttrFormulas` and `AttrSelectors.selectActive`), never stored
 * or BP/Karma-purchasable, and NOT part of `AttributeOrder` — see that constant's own comment.
 * `AttrSelectors.selectActive` is the only place that adds these on top of `AttributeOrder`
 * (only for an AI Runner); every other consumer stays untouched.
 */
export const AiAttributes: AttrKey[] = [
  AttrKey.rating,
  AttrKey.system,
  AttrKey.firewall,
  AttrKey.response,
  AttrKey.signal,
] as const

/**
 * List of matrix attributes.
 */
export const VehicleAttributes: AttrKey[] = [
  AttrKey.body,
  AttrKey.armor,
  AttrKey.pilot,
  AttrKey.handling,
  AttrKey.sensors,
] as const
