import { z } from "zod"

import type { UUID } from "#/lib/uuidUtils.ts"

import type { AttributeCatalog } from "./attributes/attributeCatalog.ts"
import type { ContactData } from "./contactData.ts"
import type {
  EntityBase,
  EntityWithAttrs,
  EntityWithDamage,
  EntityWithItems,
  EntityWithQualities,
} from "./entities/entityTraits.ts"
import type { EntityWithSkills } from "./entities/traits/entityWithSkills.ts"
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
import type { AdeptPowerData } from "./powers/adeptPowerData.ts"
import type { QualityData } from "./qualityData.ts"
import type { ReputationLedgerEntry } from "./reputation/reputationLedgerEntry.ts"
import type { RunnerWithBiology, RunnerWithData } from "./runnerTraits.ts"

/** Sentinel `sinVersion` for a runner that has never had any migration applied to it. */
export const RUNNER_META_EPOCH = "1970-01-01T00:00:00.000Z"

/**
 * Metadata for tracking the migration state of a runner sheet.
 */
export interface RunnerMeta {
  /**
   * ISO 8601 timestamp identifying this runner's most recent successful migration run — see
   * `src/data/applyMigrations.ts`. Compared against each registered migration's `timestamp` to
   * decide which migrations still need to run; individual migrations never read or write it.
   */
  sinVersion: string
  /**
   * ISO 8601 timestamp of the app version (`src/data/appVersion.ts`'s `APP_VERSION`) that most
   * recently ran a migration against this runner, or `null` if none has. Informational only — it
   * plays no part in deciding which migrations run; see `sinVersion` for that.
   */
  appVersion: string | null
  /** ISO 8601 timestamp of the runner's most recent export, or `null` if it has never been exported. */
  lastExportDate: string | null
}

export const RunnerMetaSchema = z.object({
  sinVersion: z.string().default(RUNNER_META_EPOCH),
  appVersion: z.string().nullable().default(null),
  lastExportDate: z.string().nullable().default(null),
})

type RunnerTraits =
  & EntityBase
  & EntityWithAttrs
  & EntityWithDamage
  & EntityWithItems
  & EntityWithQualities
  & EntityWithSkills
  & RunnerWithBiology
  & RunnerWithData

/**
 * The root structure of a Shadowrun 4e runner sheet.
 */
export interface RunnerData extends RunnerTraits {
  kind: EntityKind.runner
  id: UUID
  name: string
  _meta_: RunnerMeta

  profile: {
    alias: string
    name: string
    archetype: null | string
    description: null | string
    personality: null | string

    lifestyle: null | {
      quality: LifestyleType
      monthsPaid: number
    }
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

  reputation: {
    /**
     * Append-only audit trail of reputation changes. One entry per reputation
     * adjustment. Never edited or removed — corrections happen via counter-entries.
     */
    ledger: ReputationLedgerEntry[]
  }

  nuyen: {
    current: number
    loans: LoanData[]
  }

  attributes: AttributeCatalog

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
