import type { UUID } from "node:crypto"

import type { LifestyleType } from "#/lib/system/lifestyleType.ts"
import type { MetatypeType } from "#/lib/system/metatypeData.ts"
import type { AttributeKey } from "./attributeKey.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { ContactData } from "./contactData.ts"
import type { ItemData } from "./itemData.ts"
import type { AdeptPowerData } from "./magic/adeptPowerData.ts"
import type { ComplexFormData } from "./magic/complexFormData.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { SpriteData } from "./magic/spriteData.ts"
import type { TraditionData } from "./magic/traditionData.ts"
import type { QualityData } from "./qualityData.ts"
import type { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillGroupData } from "./skillData.ts"

export interface CharacterSheet {
  id: UUID
  version: `${number}.${number}.${number}`

  profile: {
    alias: string
    name: string
    archetype?: string

    streetCred: number
    notoriety: number
    publicAwarenessModifier?: number

    description?: string
    personality?: string

    lifestyle?: {
      quality: LifestyleType
      monthsPaid: number
    }
  }

  biology: {
    metatype: MetatypeType
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

  gear: Record<string, ItemData>

  skills: {
    activeSkills: ActiveSkillData[]
    skillGroups: SkillGroupData[]
    knowledgeSkills: KnowledgeSkillData[]
    languageSkills: LanguageSkillData[]
  }

  qualities: QualityData[]
  contacts: ContactData[]
  tradition?: TraditionData
  spells: SpellData[]
  complexForms: ComplexFormData[]
  sprites: SpriteData[]
  adeptPowers: AdeptPowerData[]
}
