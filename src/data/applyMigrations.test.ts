import { describe, expect, it } from "vitest"

import { APP_VERSION } from "./appVersion.ts"
import { applyMigrations } from "./applyMigrations.ts"
import { migrations } from "./migrations.ts"

describe.concurrent("applyMigrations", () => {
  it("stamps the app version when starting from {}", () => {
    // Arrange
    const runner = {}

    // Act
    const result = applyMigrations(runner)

    // Assert
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

  it("skips migrations already covered by _meta_.appVersion", () => {
    // Arrange — pre-mark migration 20251001_00 (addLoanIdAndInterestRate) as applied with a
    // known stable loan id
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

    // Assert — the loan id is preserved (the migration was not re-run, otherwise a UUID
    // would have been re-assigned only if missing)
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.appVersion).toBe(APP_VERSION)
  })

  it("translates a legacy _meta_.version into the equivalent migration timestamp", () => {
    // Arrange — the old sequential-integer scheme: version 3 means migrations 1–3 have run,
    // i.e. up through addLoanIdAndInterestRate
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { version: 3 },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — same outcome as the equivalent appVersion-stamped runner above
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.appVersion).toBe(APP_VERSION)
  })

  it("is idempotent — running it twice yields the same app version", () => {
    // Arrange
    const runner = {}

    // Act
    const first = applyMigrations(runner)
    const second = applyMigrations(first)

    // Assert
    expect(second._meta_.appVersion).toBe(first._meta_.appVersion)
    expect(second._meta_.appVersion).toBe(APP_VERSION)
  })

  it("does not bump appVersion on a load that runs no migrations", () => {
    // Arrange — already at the newest registered migration's timestamp
    const runner = { _meta_: { appVersion: migrations[migrations.length - 1].timestamp } }

    // Act
    const result = applyMigrations(runner)

    // Assert — nothing ran, so the stamped appVersion is left untouched rather than bumped to
    // the live APP_VERSION
    expect(result._meta_.appVersion).toBe(migrations[migrations.length - 1].timestamp)
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
