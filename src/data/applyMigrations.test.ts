import { describe, expect, it } from "vitest"

import { APP_VERSION } from "./appVersion.ts"
import { applyMigrations } from "./applyMigrations.ts"
import { migrations } from "./migrations.ts"

describe.concurrent("applyMigrations", () => {
  it("stamps the sin version and app version when starting from {}", () => {
    // Arrange
    const runner = {}

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result._meta_.sinVersion).toBe(APP_VERSION)
    expect(result._meta_.appVersion).toBe(APP_VERSION)
  })

  it("defensively initialises optional collection fields when missing", () => {
    // Arrange
    const runner = {}

    // Act
    const result = applyMigrations(runner)

    // Assert — fields documented in applyMigrations as defensive defaults
    expect(result.spirits).toEqual([])
    expect(result.spells).toEqual([])
    expect(result.powers).toEqual([])
    expect(result.complexForms).toEqual([])
    expect(result.sprites).toEqual([])
    expect(result.qualities).toEqual([])
    expect(result.contacts).toEqual([])
    // Not asserted empty here — migration 20260809_00 (addMatrixNode) always backfills a
    // blank flat `matrix` node first, so by the time 20260809_02 (addMatrixGameState) runs it
    // always has prior matrix data to convert into knownNodes[0]. See
    // 20260809_02_addMatrixGameState.test.ts for the "no prior matrix data" case, exercised by
    // calling that migration's `up` in isolation.
    expect(result.gameState.matrix.knownNodes).toHaveLength(1)
  })

  it("skips migrations already covered by _meta_.sinVersion", () => {
    // Arrange — pre-mark migration 20251001_00 (addLoanIdAndInterestRate) as applied with a
    // known stable loan id
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { sinVersion: "2025-10-01T00:00:00Z" },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — the loan id is preserved (the migration was not re-run, otherwise a UUID
    // would have been re-assigned only if missing)
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.sinVersion).toBe(APP_VERSION)
  })

  it("skips migrations already covered by the pre-split _meta_.appVersion", () => {
    // Arrange — a runner saved before the appVersion/sinVersion split still carries its
    // migration-tracking value under the old `appVersion` name
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { appVersion: "2025-10-01T00:00:00Z" },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — the loan id is preserved (the migration was not re-run)
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.sinVersion).toBe(APP_VERSION)
  })

  it("resolves a legacy _meta_.version of 32 directly to the matching migration's timestamp", () => {
    // Arrange — 32 is the last version under the old sequential-integer scheme: the common case
    // of a runner that's already fully migrated under it. When new migrations are added with
    // timestamps newer than the 32nd migration, they will run and update sinVersion to APP_VERSION.
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { version: 32 },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — loan id preserved, sinVersion bumped to APP_VERSION when newer migrations run
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.sinVersion).toBe(APP_VERSION)
  })

  it("treats any other legacy _meta_.version as unmigrated and safely re-runs every migration", () => {
    // Arrange — a legacy version short of 32 (a runner only ever partially migrated under the old
    // scheme) doesn't map to a specific `sinVersion`; every registered migration is idempotent, so
    // re-running all of them is safe and simpler than translating the old counter
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { version: 7 },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — addLoanIdAndInterestRate re-runs but is a no-op on a loan that already has an id
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.sinVersion).toBe(APP_VERSION)
  })

  it("is idempotent — running it twice yields the same sin version", () => {
    // Arrange
    const runner = {}

    // Act
    const first = applyMigrations(runner)
    const second = applyMigrations(first)

    // Assert
    expect(second._meta_.sinVersion).toBe(first._meta_.sinVersion)
    expect(second._meta_.sinVersion).toBe(APP_VERSION)
  })

  it("does not bump sinVersion or appVersion on a load that runs no migrations", () => {
    // Arrange — already at the newest registered migration's timestamp
    const runner = { _meta_: { sinVersion: migrations[migrations.length - 1].timestamp, appVersion: null } }

    // Act
    const result = applyMigrations(runner)

    // Assert — nothing ran, so the stamped versions are left untouched rather than bumped to
    // the live APP_VERSION
    expect(result._meta_.sinVersion).toBe(migrations[migrations.length - 1].timestamp)
    expect(result._meta_.appVersion).toBeNull()
  })

  it("removes any legacy top-level `version` field via the removeVersionField migration", () => {
    // Arrange
    const runner = { version: 1 } as object

    // Act
    const result = applyMigrations(runner) as object

    // Assert
    expect("version" in result).toBe(false)
  })

  it("runs migrations in ascending timestamp order", () => {
    // Arrange — call sites depend on this ordering invariant
    const sortedTimestamps = [...migrations]
      .map((m) => new Date(m.timestamp).getTime())
      .sort((a, b) => a - b)

    // Act
    const actualTimestamps = migrations.map((m) => new Date(m.timestamp).getTime())

    // Assert
    expect(actualTimestamps).toEqual(sortedTimestamps)
  })

  it("does not mutate the input object", () => {
    // Arrange
    const runner = { spells: [{ name: "Fireball" }] }
    const snapshot = JSON.parse(JSON.stringify(runner)) as typeof runner

    // Act
    applyMigrations(runner)

    // Assert
    expect(runner).toEqual(snapshot)
  })
})
