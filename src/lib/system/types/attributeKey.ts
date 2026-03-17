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

export const AttributeLabels: Record<AttributeKey, string> = {
  body: "BOD",
  agility: "AGI",
  reaction: "REA",
  strength: "STR",
  charisma: "CHA",
  intuition: "INT",
  logic: "LOG",
  willpower: "WIL",
  edge: "EDG",
  essence: "ESS",
  magic: "MAG",
  resonance: "RES"
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
  AttributeKey.resonance
]

export const PhysicalAttributes = [
  AttributeKey.body,
  AttributeKey.agility,
  AttributeKey.reaction,
  AttributeKey.strength
] as const

export const MentalAttributes = [
  AttributeKey.charisma,
  AttributeKey.intuition,
  AttributeKey.logic,
  AttributeKey.willpower
] as const

export const SpecialAttributes = [
  AttributeKey.edge,
  AttributeKey.essence,
  AttributeKey.magic,
  AttributeKey.resonance
] as const
