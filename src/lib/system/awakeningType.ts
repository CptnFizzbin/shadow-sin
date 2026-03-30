import type { AttributeInfo } from "#/lib/system/AttributeInfo.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export enum AwakeningType {
  Mundane = "Mundane",
  Adept = "Adept",
  Magician = "Magician",
  MysticAdept = "Mystic Adept",
  Technomancer = "Technomancer",
}

export const MagicAwakeningTypes: AwakeningType[] = [
  AwakeningType.Adept,
  AwakeningType.Magician,
  AwakeningType.MysticAdept,
]

export const TechAwakeningTypes: AwakeningType[] = [AwakeningType.Technomancer]

export const awakenings: Record<AwakeningType, AwakeningData> = {
  "Mundane": {
    name: AwakeningType.Mundane,
    cost: 0,
    qualities: [],
    attributes: {
      magic: { min: 0, max: 0 },
      resonance: { min: 0, max: 0 },
    },
  },
  "Adept": {
    name: AwakeningType.Adept,
    cost: 5,
    qualities: [],
    attributes: {
      magic: { min: 1, max: 6 },
      resonance: { min: 0, max: 0 },
    },
  },
  "Mystic Adept": {
    name: AwakeningType.MysticAdept,
    cost: 10,
    qualities: [],
    attributes: {
      magic: { min: 1, max: 6 },
      resonance: { min: 0, max: 0 },
    },
  },
  "Magician": {
    name: AwakeningType.Magician,
    cost: 15,
    qualities: [],
    attributes: {
      magic: { min: 1, max: 6 },
      resonance: { min: 0, max: 0 },
    },
  },
  "Technomancer": {
    name: AwakeningType.Technomancer,
    cost: 10,
    qualities: [],
    attributes: {
      magic: { min: 0, max: 0 },
      resonance: { min: 1, max: 6 },
    },
  },
}

export interface AwakeningData {
  name: AwakeningType
  cost: number
  qualities: QualityData[]
  attributes: {
    [AttributeKey.magic]: AttributeInfo
    [AttributeKey.resonance]: AttributeInfo
  }
}
