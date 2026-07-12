import type { UUID } from "node:crypto"

import { z } from "zod"

import type { AttributeKey } from "./attributeKey.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { ContactData } from "./contactData.ts"
import type { FeatureFlagsData } from "./featureFlags/featureFlagsData.ts"
import type { ItemData } from "./itemData.ts"
import type { KarmaLedgerEntry } from "./karma/karmaLedgerEntry.ts"
import type { LifestyleType } from "./lifestyleType.ts"
import type { LoanData } from "./loanData.ts"
import type { ComplexFormData } from "./magic/complexFormData.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { SpiritData } from "./magic/spiritData.ts"
import type { SpriteData } from "./magic/spriteData.ts"
import type { TraditionData } from "./magic/traditionData.ts"
import type { MetatypeType } from "./metatypeData.ts"
import type { AdeptPowerData } from "./powers/adeptPowerData.ts"
import type { QualityData } from "./qualityData.ts"
import type { ActiveSkillData } from "./skills/activeSkillData"
import type { KnowledgeSkillData } from "./skills/knowledgeSkillData"
import type { LanguageSkillData } from "./skills/languageSkillData"
import type { SkillGroupData } from "./skills/skillGroupData"

export const RUNNER_DATA_VERSION = 1

/**
 * Metadata for tracking the version and migration state of a runner sheet.
 */
export interface RunnerMeta {
  version: number
  /** IDs of all migrations that have already been applied to this runner. */
  appliedMigrations: string[]
}

export const RunnerMetaSchema = z.object({
  version: z.number().default(0),
  appliedMigrations: z.string().array().default([]),
})

/**
 * The root structure of a Shadowrun 4e runner sheet.
 */
export interface RunnerData {

  id: UUID
  _meta_: RunnerMeta

  profile: {
    alias: string
    name: string
    archetype: null | string

    streetCred: number
    notoriety: number
    publicAwarenessModifier?: number

    description: null | string
    personality: null | string

    lifestyle: null | {
      quality: LifestyleType
      monthsPaid: number
    }
  }

  biology: {
    metatype: MetatypeType
    awakening: AwakeningType
    gender: null | string
    age: null | number
    weight: null | string
    height: null | string
  }

  karma: {
    total: number
    current: number
    /**
     * Append-only audit trail of karma earns and spends. One entry per
     * applied improvement and per Add Karma submit. Never edited or removed —
     * corrections happen via counter-entries.
     */
    log: KarmaLedgerEntry[]
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

  initiative: {
    passesCompleted: number[]
    rolledResults?: number[]
    goingFirst?: boolean
    extraPasses?: number
  }

  qualities: QualityData[]
  contacts: ContactData[]
  tradition: TraditionData | null
  spells: SpellData[]
  complexForms: ComplexFormData[]
  sprites: SpriteData[]
  spirits: SpiritData[]
  powers: AdeptPowerData[]

  /**
   * Per-runner feature flags. Optional so pre-migration runners remain
   * structurally valid; the migration backfills this on next load.
   */
  featureFlags: FeatureFlagsData
}
