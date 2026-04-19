import type { UUID } from "node:crypto"

import { z } from "zod"

import type { LifestyleType } from "#/lib/system/lifestyleType.ts"
import type { MetatypeType } from "#/lib/system/metatypeData.ts"
import type { ActiveSkillData } from "#/lib/system/skills/activeSkillData"
import type { KnowledgeSkillData } from "#/lib/system/skills/knowledgeSkillData"
import type { LanguageSkillData } from "#/lib/system/skills/languageSkillData"
import type { SkillGroupData } from "#/lib/system/skills/skillGroupData"
import type { AttributeKey } from "./attributeKey.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { ContactData } from "./contactData.ts"
import type { ItemData } from "./itemData.ts"
import type { LoanData } from "./loanData.ts"
import type { AdeptPowerData } from "./magic/adeptPowerData.ts"
import type { ComplexFormData } from "./magic/complexFormData.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { SpriteData } from "./magic/spriteData.ts"
import type { TraditionData } from "./magic/traditionData.ts"
import type { QualityData } from "./qualityData.ts"

export interface CharacterMeta {
  version: number
  /** IDs of all migrations that have already been applied to this character. */
  appliedMigrations: string[]
}

export const CharacterMetaSchema = z.object({
  version: z.number().default(0),
  appliedMigrations: z.array(z.string()).default([]),
})

export interface CharacterSheet {
  id: UUID
  _meta_: CharacterMeta

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
    loans: LoanData[]
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

  initiative?: {
    passesCompleted: number[]
  }

  qualities: QualityData[]
  contacts: ContactData[]
  tradition?: TraditionData
  spells: SpellData[]
  complexForms: ComplexFormData[]
  sprites: SpriteData[]
  adeptPowers: AdeptPowerData[]
}
