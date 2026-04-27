import type { UUID } from "node:crypto"

import { z } from "zod"

import type { AttributeKey } from "./attributeKey.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { ContactData } from "./contactData.ts"
import type { ItemData } from "./itemData.ts"
import type { LifestyleType } from "./lifestyleType.ts"
import type { LoanData } from "./loanData.ts"
import type { AdeptPowerData } from "./magic/adeptPowerData.ts"
import type { ComplexFormData } from "./magic/complexFormData.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { SpiritData } from "./magic/spiritData.ts"
import type { SpriteData } from "./magic/spriteData.ts"
import type { TraditionData } from "./magic/traditionData.ts"
import type { ManualStatus } from "./manualStatus.ts"
import type { MetatypeType } from "./metatypeData.ts"
import type { QualityData } from "./qualityData.ts"
import type { ActiveSkillData } from "./skills/activeSkillData"
import type { KnowledgeSkillData } from "./skills/knowledgeSkillData"
import type { LanguageSkillData } from "./skills/languageSkillData"
import type { SkillGroupData } from "./skills/skillGroupData"

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
    rolledResults?: number[]
    goingFirst?: boolean
    extraPasses?: number
  }

  qualities: QualityData[]
  contacts: ContactData[]
  tradition?: TraditionData
  spells: SpellData[]
  complexForms: ComplexFormData[]
  sprites: SpriteData[]
  spirits: SpiritData[]
  adeptPowers: AdeptPowerData[]

  /** Player-entered temporary modifiers applied during play (drugs, spell hits, etc.). */
  manualStatuses?: ManualStatus[]
}
