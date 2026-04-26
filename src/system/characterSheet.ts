import type { UUID } from "node:crypto"

import { z } from "zod"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { AwakeningType } from "#/system/awakeningType.ts"
import type { ContactData } from "#/system/contactData.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { LifestyleType } from "#/system/lifestyleType.ts"
import type { LoanData } from "#/system/loanData.ts"
import type { AdeptPowerData } from "#/system/magic/adeptPowerData.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"
import type { MetatypeType } from "#/system/metatypeData.ts"
import type { QualityData } from "#/system/qualityData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"
import type { SkillGroupData } from "#/system/skills/skillGroupData"

export const CHARACTER_SHEET_VERSION = 1

/**
 * Metadata for tracking the version and migration state of a character sheet.
 */
export interface CharacterMeta {
  version: number
  /** IDs of all migrations that have already been applied to this character. */
  appliedMigrations: string[]
}

export const CharacterMetaSchema = z.object({
  version: z.number().default(0),
  appliedMigrations: z.string().array().default([]),
})

/**
 * The root structure of a Shadowrun 4e character sheet.
 */
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
    rolledScore?: number
    goingFirst?: boolean
  }

  qualities: QualityData[]
  contacts: ContactData[]
  tradition?: TraditionData
  spells: SpellData[]
  complexForms: ComplexFormData[]
  sprites: SpriteData[]
  spirits: SpiritData[]
  adeptPowers: AdeptPowerData[]
}
