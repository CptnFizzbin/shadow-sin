import { z } from "zod"

import type { UUID } from "#/lib/uuidUtils.ts"

import type { AttributeKey } from "./attributeKey.ts"
import type { AwakeningType } from "./awakeningType.ts"
import type { ContactData } from "./contactData.ts"
import type {
  EntityWithAttrs,
  EntityWithDamage,
  EntityWithItems,
  EntityWithQualities,
} from "./entities/entityTraits.ts"
import type { EntityData } from "./entityData.ts"
import type { EntityKind } from "./entityKind.ts"
import type { KarmaLedgerEntry } from "./karma/karmaLedgerEntry.ts"
import type { LifestyleType } from "./lifestyleType.ts"
import type { LoanData } from "./loanData.ts"
import type { ComplexFormData } from "./magic/complexFormData.ts"
import type { SpellData } from "./magic/spellData.ts"
import type { SpiritData } from "./magic/spiritData.ts"
import type { SpriteData } from "./magic/spriteData.ts"
import type { TraditionData } from "./magic/traditionData.ts"
import type { MatrixGameState } from "./matrix/matrixGameState.ts"
import type { MetatypeType } from "./metatypeData.ts"
import type { AdeptPowerData } from "./powers/adeptPowerData.ts"
import type { QualityData } from "./qualityData.ts"
import type { RunnerWithData } from "./runnerTraits.ts"
import type { ActiveSkillData } from "./skills/activeSkillData"
import type { KnowledgeSkillData } from "./skills/knowledgeSkillData"
import type { LanguageSkillData } from "./skills/languageSkillData"
import type { SkillGroupData } from "./skills/skillGroupData"

/**
 * Metadata for tracking the migration state of a runner sheet.
 */
export interface RunnerMeta {
  /** The highest migration version that has been applied to this runner — see `src/data/migrations.ts`. */
  version: number
  /** ISO 8601 timestamp of the runner's most recent export, or `null` if it has never been exported. */
  lastExportDate: string | null
}

export const RunnerMetaSchema = z.object({
  version: z.number().default(0),
  lastExportDate: z.string().nullable().default(null),
})

/**
 * The root structure of a Shadowrun 4e runner sheet.
 */
export interface RunnerData extends EntityData, EntityWithItems, EntityWithDamage, EntityWithAttrs, EntityWithQualities, RunnerWithData {
  kind: EntityKind.runner
  id: UUID
  name: string
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

  /** Not every key is populated — a Runner never sets the four Matrix stats. See `selectAttrBase`/`selectAttrValue`. */
  attributes: Partial<Record<AttributeKey, number>>

  edge: {
    current: number
  }

  damage: {
    physical: number
    stun: number
    matrix: number
  }

  /** Player-facing Matrix session state — Known Nodes, the Active Node, and running Programs/Agents. */
  gameState: {
    matrix: MatrixGameState
  }

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

  /** Magician/Adept/Mystic Adept initiate grade. 0 until first Initiation. */
  initiateGrade: number
  /** Technomancer submersion grade. 0 until first Submersion. */
  submersionGrade: number
  powers: AdeptPowerData[]
}
