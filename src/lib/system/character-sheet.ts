import type { UUID } from "node:crypto"

import type { LifestyleType } from "#/lib/system/lifestyle-type.ts"
import type { MetatypeType } from "#/lib/system/metatype-data.ts"
import type { AttributeKey } from "./attribute-key.ts"
import type { AwakeningType } from "./awakening-type.ts"
import type { ContactData } from "./contact-data.ts"
import type { ItemData } from "./item-data.ts"
import type { AdeptPowerData } from "./magic/adept-power-data.ts"
import type { ComplexFormData } from "./magic/complex-form-data.ts"
import type { SpellData } from "./magic/spell-data.ts"
import type { SpriteData } from "./magic/sprite-data.ts"
import type { TraditionData } from "./magic/tradition-data.ts"
import type { QualityData } from "./quality-data.ts"
import type { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillGroupData } from "./skill-data.ts"

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
