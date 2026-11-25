import { describe, expect, it, vi } from "vitest"

import { APP_VERSION } from "./appVersion.ts"
import { applyMigrations, resolveRawRunnerSinVersion } from "./applyMigrations.ts"
import { LATEST_MIGRATION_TIMESTAMP, migrations } from "./migrations.ts"

describe.concurrent("applyMigrations", () => {
  it("stamps sinVersion to the latest migration timestamp and appVersion to the live app version when starting from {}", () => {
    // Arrange
    const runner = {}

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
    expect(result._meta_.appVersion).toBe(APP_VERSION)
  })

  it("defensively initialises optional collection fields when missing", () => {
    // Arrange — already at the newest migration, so no migration runs and only the defensive
    // defaults can supply these fields
    const runner = { _meta_: { sinVersion: LATEST_MIGRATION_TIMESTAMP, appVersion: null } }

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result.spirits).toEqual([])
    expect(result.spells).toEqual([])
    expect(result.powers).toEqual([])
    expect(result.complexForms).toEqual([])
    expect(result.sprites).toEqual([])
    expect(result.qualities).toEqual([])
    expect(result.contacts).toEqual([])
    expect(result.tradition).toBeNull()
    expect(result.items).toEqual({ parentId: null, childIds: [] })
    expect(result.initiative).toEqual({ passesCompleted: [] })
    expect(result.gameState).toEqual({ matrix: { knownNodes: [], activePrograms: [] } })
  })

  it("skips migrations already covered by _meta_.sinVersion", () => {
    // Arrange — marked as migrated up to and including removeVersionField (2026-04-19), so a
    // top-level `version` it would delete must survive, while later migrations still run
    const runner = {
      _meta_: { sinVersion: "2026-04-19T00:00:00Z" },
      version: 3,
    }

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result).toHaveProperty("version", 3)
    expect(result.kind).toBe("runner")
    expect(result._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
  })

  it("skips migrations already covered by the pre-split _meta_.appVersion", () => {
    // Arrange — a runner saved before the appVersion/sinVersion split still carries its
    // migration-tracking value under the old `appVersion` name
    const runner = {
      _meta_: { appVersion: "2026-04-19T00:00:00Z" },
      version: 3,
    }

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result).toHaveProperty("version", 3)
    expect(result.kind).toBe("runner")
    expect(result._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
  })

  it("resolves a legacy _meta_.version of 32 directly to the matching migration's timestamp", () => {
    // Arrange — the 32nd migration (dropIncompleteQualitySource) would drop this quality's
    // page-less source, and the 33rd (addReputationLedger) adds a reputation ledger
    const runner = {
      _meta_: { version: 32 },
      version: 3,
      qualities: [{ name: "Ambidextrous", source: { book: "SR4A" } }],
    }

    // Act
    const resolvedSinVersion = resolveRawRunnerSinVersion(runner)
    const result = applyMigrations(runner)

    // Assert — migrations up to and including the 32nd were skipped, later ones ran
    expect(resolvedSinVersion).toBe("2026-08-23T17:38:57Z")
    expect(result).toHaveProperty("version", 3)
    expect(result.qualities[0].source).toEqual({ book: "SR4A" })
    expect(result.reputation.ledger).toEqual([])
    expect(result._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
  })

  it("treats any other legacy _meta_.version as unmigrated and safely re-runs every migration", () => {
    // Arrange — a legacy version short of 32 (a runner only ever partially migrated under the old
    // scheme) doesn't map to a specific `sinVersion`; every registered migration is idempotent, so
    // re-running all of them is safe and simpler than translating the old counter
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { version: 7 },
      version: 3,
      qualities: [{ name: "Ambidextrous", source: { book: "SR4A" } }],
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — early (removeVersionField) and late (dropIncompleteQualitySource) migrations both
    // re-ran, and addLoanIdAndInterestRate's re-run kept the existing loan id
    expect(result).not.toHaveProperty("version")
    expect(result.qualities[0].source).toBeUndefined()
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
  })

  it("is idempotent — running it twice yields the same sin version", () => {
    // Arrange
    const runner = {}

    // Act
    const first = applyMigrations(runner)
    const second = applyMigrations(first)

    // Assert
    expect(second._meta_.sinVersion).toBe(first._meta_.sinVersion)
    expect(second._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
  })

  it("does not bump sinVersion or appVersion on a load that runs no migrations", () => {
    // Arrange — already at the newest registered migration's timestamp
    const runner = { _meta_: { sinVersion: LATEST_MIGRATION_TIMESTAMP, appVersion: null } }

    // Act
    const result = applyMigrations(runner)

    // Assert — nothing ran, so the stamped versions are left untouched rather than bumped
    expect(result._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
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

// Sequential: the spies observe calls to the shared migration registry, so a concurrent
// applyMigrations call would pollute the recorded call order.
describe("applyMigrations call order", () => {
  it("runs migrations in ascending timestamp order", () => {
    // Arrange
    const spies = migrations.map((migration) => ({
      timestamp: migration.timestamp,
      spy: vi.spyOn(migration, "up"),
    }))

    // Act
    let calls: { timestamp: string, callOrder: number | undefined }[]
    try {
      applyMigrations({})
      calls = spies.map(({ timestamp, spy }) => ({ timestamp, callOrder: spy.mock.invocationCallOrder.at(0) }))
    } finally {
      for (const { spy } of spies) spy.mockRestore()
    }

    // Assert
    const calledTimestamps = calls
      .filter((call): call is { timestamp: string, callOrder: number } => call.callOrder !== undefined)
      .sort((left, right) => left.callOrder - right.callOrder)
      .map(({ timestamp }) => new Date(timestamp).getTime())
    expect(calledTimestamps).toHaveLength(migrations.length)
    expect(calledTimestamps).toEqual([...calledTimestamps].sort((left, right) => left - right))
  })
})
