import { describe, expect, it } from "vitest"

import { RUNNER_DATA_VERSION } from "#/system/runnerData.ts"

import { applyMigrations } from "./applyMigrations.ts"
import { migrationIds, migrations } from "./migrations.ts"

describe("applyMigrations", () => {
  it("stamps the current version and records every migration id when starting from {}", () => {
    // Arrange
    const runner = {}

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result._meta_.version).toBe(RUNNER_DATA_VERSION)
    for (const migrationId of migrationIds) {
      expect(result._meta_.appliedMigrations).toContain(migrationId)
    }
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
  })

  it("skips migrations whose id is already in appliedMigrations", () => {
    // Arrange — pre-mark the loan migration as applied with a known stable loan id
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const runner = {
      _meta_: { appliedMigrations: ["20251001"] },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(runner)

    // Assert — the loan id is preserved (20251001 was not re-run, otherwise a UUID would have been re-assigned only if missing)
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    // 20251001 still appears as an applied migration, alongside any newly-applied ones
    expect(result._meta_.appliedMigrations).toContain("20251001")
  })

  it("is idempotent — running it twice yields the same set of applied migrations", () => {
    // Arrange
    const runner = {}

    // Act
    const first = applyMigrations(runner)
    const second = applyMigrations(first)

    // Assert
    expect(new Set(second._meta_.appliedMigrations)).toEqual(
      new Set(first._meta_.appliedMigrations),
    )
    expect(second._meta_.version).toBe(RUNNER_DATA_VERSION)
  })

  it("removes any legacy top-level `version` field via the 20260419 migration", () => {
    // Arrange
    const runner = { version: 1 } as object

    // Act
    const result = applyMigrations(runner) as object

    // Assert
    expect("version" in result).toBe(false)
  })

  it("runs migrations in ascending id order", () => {
    // Arrange — call sites depend on this ordering invariant
    const sortedIds = [...migrations].map((m) => m.id).sort()

    // Act
    const actualIds = migrations.map((m) => m.id)

    // Assert
    expect(actualIds).toEqual(sortedIds)
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
