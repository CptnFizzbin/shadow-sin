export type AttributeKey =
  | "body"
  | "agility"
  | "reaction"
  | "strength"
  | "charisma"
  | "intuition"
  | "logic"
  | "willpower"
  | "edge"
  | "essence"
  | "magic"
  | "resonance";

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
  "body",
  "agility",
  "reaction",
  "strength",
  "charisma",
  "intuition",
  "logic",
  "willpower",
  "edge",
  "essence",
  "magic",
  "resonance"
]
