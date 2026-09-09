import type { AttributeInfoCatalog } from "./attributes/attributeCatalog.ts"
import { createAttrInfoCatalog } from "./attributes/attributeCatalog.ts"
import type { QualityData } from "./qualityData.ts"

export enum AwakeningType {
  Mundane = "Mundane",
  Adept = "Adept",
  Magician = "Magician",
  MysticAdept = "Mystic Adept",
  Technomancer = "Technomancer",
  /**
   * Reserved exclusively for the AI metatype — AIs may never have a Magic or Resonance
   * attribute at all, which reads differently from a metahuman choosing Mundane. Auto-assigned
   * when a Runner's metatype switches to AI; never offered as a manual choice for any other
   * metatype (see `biologySection.tsx`).
   */
  None = "None",
}

export const MagicAwakeningTypes: AwakeningType[] = [
  AwakeningType.Adept,
  AwakeningType.Magician,
  AwakeningType.MysticAdept,
]

export const TechAwakeningTypes: AwakeningType[] = [AwakeningType.Technomancer]

/** True for Adept, Magician, and Mystic Adept — the Awakened types with a Magic attribute. */
export const isMagical = (awakeningType: AwakeningType): boolean => {
  return MagicAwakeningTypes.includes(awakeningType)
}

export const awakenings: Record<AwakeningType, AwakeningData> = {
  "Mundane": {
    name: AwakeningType.Mundane,
    cost: 0,
    qualities: [],
    attributes: createAttrInfoCatalog({
      magic: { min: 0, max: 0 },
      resonance: { min: 0, max: 0 },
    }),
  },
  "Adept": {
    name: AwakeningType.Adept,
    cost: 5,
    qualities: [],
    attributes: createAttrInfoCatalog({
      magic: { min: 1, max: 6 },
      resonance: { min: 0, max: 0 },
    }),
  },
  "Mystic Adept": {
    name: AwakeningType.MysticAdept,
    cost: 10,
    qualities: [],
    attributes: createAttrInfoCatalog({
      magic: { min: 1, max: 6 },
      resonance: { min: 0, max: 0 },
    }),
  },
  "Magician": {
    name: AwakeningType.Magician,
    cost: 15,
    qualities: [],
    attributes: createAttrInfoCatalog({
      magic: { min: 1, max: 6 },
      resonance: { min: 0, max: 0 },
    }),
  },
  "Technomancer": {
    name: AwakeningType.Technomancer,
    cost: 10,
    qualities: [],
    attributes: createAttrInfoCatalog({
      magic: { min: 0, max: 0 },
      resonance: { min: 1, max: 6 },
    }),
  },
  "None": {
    name: AwakeningType.None,
    cost: 0,
    qualities: [],
    attributes: createAttrInfoCatalog({
      magic: { min: 0, max: 0 },
      resonance: { min: 0, max: 0 },
    }),
  },
}

export interface AwakeningData {
  name: AwakeningType
  cost: number
  qualities: QualityData[]
  attributes: AttributeInfoCatalog
}
