/**
 * Keys for all attributes in Shadowrun 4e.
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
}

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
