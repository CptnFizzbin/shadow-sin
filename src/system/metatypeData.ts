import type { AttributeInfo } from "./attributeInfo.ts"
import type { AttributeKey } from "./attributeKey.ts"
import type { MovementData } from "./movementData.ts"
import type { CritterPowerData } from "./powers/critterPowerData.ts"
import type { QualityData } from "./qualityData.ts"

export enum MetatypeGroup {
  metahuman = "metahuman",
  critter = "critter",
  exotic = "exotic",
  custom = "custom",
}

export enum MetatypeType {
  // Metahumans
  Human = "Human",
  Ork = "Ork",
  Dwarf = "Dwarf",
  Elf = "Elf",
  Troll = "Troll",

  // Critters
  Pixie = "Pixie",

  // Exotic
  AI = "AI",
}

export interface MetatypeData {
  name: MetatypeType
  group?: MetatypeGroup
  cost: number
  attributes: Record<AttributeKey, AttributeInfo>
  innateQualities?: QualityData[]
  innatePowers?: CritterPowerData[]
  movement: MovementData | MovementData[]
}

const baseAttributes = {
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
    group: MetatypeGroup.metahuman,
    cost: 0,
    movement: { walk: 10, run: 25 },
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
    group: MetatypeGroup.metahuman,
    cost: 20,
    movement: { walk: 10, run: 25 },
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
    group: MetatypeGroup.metahuman,
    cost: 25,
    movement: { walk: 8, run: 20 },
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
    group: MetatypeGroup.metahuman,
    cost: 30,
    movement: { walk: 10, run: 25 },
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
    group: MetatypeGroup.metahuman,
    cost: 40,
    movement: { walk: 15, run: 35 },
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
  Pixie: {
    name: MetatypeType.Pixie,
    group: MetatypeGroup.critter,
    cost: 35,
    movement: [
      { type: "ground", walk: 1, run: 4 },
      { type: "fly", walk: 20, run: 50 },
    ],
    attributes: {
      ...baseAttributes,
      body: { min: 1, max: 3, augMax: 5 },
      agility: { min: 3, max: 8, augMax: 12 },
      reaction: { min: 3, max: 8, augMax: 12 },
      strength: { min: 1, max: 3, augMax: 5 },
      charisma: { min: 3, max: 8, augMax: 12 },
      intuition: { min: 2, max: 7, augMax: 10 },
      logic: { min: 2, max: 7, augMax: 10 },
      willpower: { min: 3, max: 8, augMax: 12 },
      edge: { min: 1, max: 7 },
      magic: { min: 1, max: 6 },
    },
    innatePowers: [
      {
        type: "critterPower" as const,
        id: "3f8a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
        name: "Concealment (Self Only)",
        source: { book: "SR4A", page: 293 },
      },
      {
        type: "critterPower" as const,
        id: "4a9b2c3d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        name: "Enhanced Senses (Astral Perception)",
        source: { book: "SR4A", page: 294 },
      },
      {
        type: "critterPower" as const,
        id: "5b0c3d4e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        name: "Sapience",
        source: { book: "SR4A", page: 297 },
      },
    ],
    innateQualities: [
      {
        id: "6c1d4e5f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
        name: "Vanish",
        type: "negative",
        source: { book: "RC", page: 85 },
      },
      {
        id: "7d2e5f6a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
        name: "Uneducated",
        type: "negative",
        bpValue: 20,
        source: { book: "SR4A", page: 119 },
      },
    ],
  },
  AI: {
    name: MetatypeType.AI,
    group: MetatypeGroup.exotic,
    cost: 110,
    movement: { walk: 0, run: 0 },
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
