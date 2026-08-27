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
}

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
 * List of matrix attributes.
 */
export const VehicleAttributes: AttrKey[] = [
  AttrKey.body,
  AttrKey.armor,
  AttrKey.pilot,
  AttrKey.handling,
  AttrKey.sensors,
] as const
