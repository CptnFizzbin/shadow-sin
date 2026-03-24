import type { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import type { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import type { AttributeKey } from "./attributeKey.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { ContactData } from "./contactData.ts"
import type { GearData } from "./gear/gearData.ts"
import type { AdeptPowerData } from "./magic/adeptPowerData.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { QualityData } from "./qualityData.ts"
import type { SkillData } from "./skillData.ts"

export interface PlayerCharacterData {
  id: string
  version: number

  profile: {
    alias: string
    name: string
    archetype?: string

    streetCred: number
    notoriety: number

    description?: string
    personality?: string

    lifestyle?: {
      quality: LifestyleType
      cost: number
      monthsPaid: number
    }
  }

  biology: {
    metatype: MetatypeKey
    awakening: AwakeningType
    gender?: string
    age?: number
    weight?: string
    height?: string
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

  edge: {
    current: number
  }

  damage: {
    physical: number
    stun: number
    matrix: number
  }

  gear: Record<string, GearData>
  skills: Record<string, SkillData>
  qualities: QualityData[]
  contacts: ContactData[]

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
