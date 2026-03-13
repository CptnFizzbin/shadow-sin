import type { GearData } from "./gear/gearData.ts"
import type { GearType } from "./gear/gearData.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { AttributeKey } from "./attributeKey.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { AdeptPowerData } from "./magic/adeptPowerData.ts"
import type { SkillData } from "./skillData.ts"
import type { QualityData } from "./qualityData.ts"

export interface PlayerCharacterData {
  id: string
  version: number

  biology: {
    metatype: string
    gender?: string
    age?: number
    weight?: string
    height?: string
    awakening: AwakeningType
  }

  profile: {
    alias: string
    name: string
    archetype?: string

    streetCred: number
    notoriety: number
    publicAwareness: number
    currentEdge: number

    description?: string
    personality?: string

    lifestyle?: {
      quality: number
      cost: number
      monthsPaid: number
    }
  }

  karma: {
    total: number
    current: number
  }

  nuyen: {
    current: number
    loans: Array<{
      lender: string
      amount: number
      notes?: string
    }>
  }

  attributes: Record<AttributeKey, number>

  damage: {
    physical: {
      current: number
      max: number
    }

    stun: {
      current: number
      max: number
    }

    matrix: {
      current: number
      max: number
    }
  }

  gear: Record<GearType, GearData[]>
  skills: Record<string, SkillData>
  qualities: QualityData[]

  spellcasting?: {
    knownSpells: SpellData[]
  }

  adept?: {
    powerPoints: {
      spent: number
      max: number
    }

    powers: AdeptPowerData[]
  }
}
