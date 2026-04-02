import type { AttributeInfo } from "#/lib/system/attribute-info.ts"
import type { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { GameEffectData } from "#/lib/system/game-effect-data.ts"

export enum MetatypeType {
  Human = "Human",
  Ork = "Ork",
  Dwarf = "Dwarf",
  Elf = "Elf",
  Troll = "Troll",
  AI = "AI",
}

export interface MetatypeData {
  name: MetatypeType
  cost: number
  attributes: Record<AttributeKey, AttributeInfo>
  inateAbilites?: GameEffectData[]
}

export const baseAttributes = {
  body: { min: 1, max: 6, augMax: 9 },
  agility: { min: 1, max: 6, augMax: 9 },
  reaction: { min: 1, max: 6, augMax: 9 },
  strength: { min: 1, max: 6, augMax: 9 },
  charisma: { min: 1, max: 6, augMax: 9 },
  intuition: { min: 1, max: 6, augMax: 9 },
  logic: { min: 1, max: 6, augMax: 9 },
  willpower: { min: 1, max: 6, augMax: 9 },
  edge: { min: 1, max: 6 },
  essence: { min: 0, max: 6 },
  magic: { min: 0, max: 0 },
  resonance: { min: 0, max: 0 },
} as const

export const metatypes: Record<MetatypeType, MetatypeData> = {
  Human: {
    name: MetatypeType.Human,
    cost: 0,
    attributes: {
      ...baseAttributes,
      body: { min: 1, max: 6, augMax: 9 },
      agility: { min: 1, max: 6, augMax: 9 },
      reaction: { min: 1, max: 6, augMax: 9 },
      strength: { min: 1, max: 6, augMax: 9 },
      charisma: { min: 1, max: 6, augMax: 9 },
      intuition: { min: 1, max: 6, augMax: 9 },
      logic: { min: 1, max: 6, augMax: 9 },
      willpower: { min: 1, max: 6, augMax: 9 },
      edge: { min: 2, max: 7 },
    },
  },
  Ork: {
    name: MetatypeType.Ork,
    cost: 20,
    attributes: {
      ...baseAttributes,
      body: { min: 4, max: 9, augMax: 13 },
      agility: { min: 1, max: 6, augMax: 9 },
      reaction: { min: 1, max: 6, augMax: 9 },
      strength: { min: 3, max: 8, augMax: 12 },
      charisma: { min: 1, max: 5, augMax: 7 },
      intuition: { min: 1, max: 6, augMax: 9 },
      logic: { min: 1, max: 5, augMax: 7 },
      willpower: { min: 1, max: 6, augMax: 9 },
      edge: { min: 1, max: 6 },
    },
  },
  Dwarf: {
    name: MetatypeType.Dwarf,
    cost: 25,
    attributes: {
      ...baseAttributes,
      body: { min: 2, max: 7, augMax: 10 },
      agility: { min: 1, max: 6, augMax: 9 },
      reaction: { min: 1, max: 5, augMax: 7 },
      strength: { min: 3, max: 8, augMax: 12 },
      charisma: { min: 1, max: 5, augMax: 7 },
      intuition: { min: 1, max: 6, augMax: 9 },
      logic: { min: 1, max: 6, augMax: 9 },
      willpower: { min: 1, max: 7, augMax: 10 },
      edge: { min: 1, max: 6 },
    },
  },
  Elf: {
    name: MetatypeType.Elf,
    cost: 30,
    attributes: {
      ...baseAttributes,
      body: { min: 1, max: 6, augMax: 9 },
      agility: { min: 2, max: 7, augMax: 10 },
      reaction: { min: 1, max: 6, augMax: 9 },
      strength: { min: 1, max: 6, augMax: 9 },
      charisma: { min: 3, max: 8, augMax: 12 },
      intuition: { min: 1, max: 6, augMax: 9 },
      logic: { min: 1, max: 6, augMax: 9 },
      willpower: { min: 1, max: 6, augMax: 9 },
      edge: { min: 1, max: 6 },
    },
  },
  Troll: {
    name: MetatypeType.Troll,
    cost: 40,
    attributes: {
      ...baseAttributes,
      body: { min: 5, max: 10, augMax: 15 },
      agility: { min: 1, max: 5, augMax: 7 },
      reaction: { min: 1, max: 6, augMax: 9 },
      strength: { min: 5, max: 10, augMax: 15 },
      charisma: { min: 1, max: 4, augMax: 6 },
      intuition: { min: 1, max: 5, augMax: 7 },
      logic: { min: 1, max: 5, augMax: 7 },
      willpower: { min: 1, max: 6, augMax: 9 },
      edge: { min: 1, max: 6 },
    },
  },
  AI: {
    name: MetatypeType.AI,
    cost: 110,
    attributes: {
      ...baseAttributes,
      body: { min: 0, max: 0 },
      agility: { min: 0, max: 0 },
      reaction: { min: 0, max: 0 },
      strength: { min: 0, max: 0 },
      charisma: { min: 1, max: 6 },
      intuition: { min: 1, max: 6 },
      logic: { min: 1, max: 6 },
      willpower: { min: 1, max: 6 },
      edge: { min: 1, max: 6 },
      essence: { min: 0, max: 0 },
      magic: { min: 0, max: 0 },
      resonance: { min: 0, max: 0 },
    },
  },
}
