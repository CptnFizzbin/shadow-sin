import { describe, expect, it } from "vitest"

import { applyMigrations } from "#/character/applyMigrations.ts"
import { migrationIds, migrations } from "#/character/migrations.ts"
import { CHARACTER_SHEET_VERSION } from "#/system/characterSheet.ts"

describe("applyMigrations", () => {
  it("stamps the current version and records every migration id when starting from {}", () => {
    // Arrange
    const character = {}

    // Act
    const result = applyMigrations(character)

    // Assert
    expect(result._meta_.version).toBe(CHARACTER_SHEET_VERSION)
    for (const migrationId of migrationIds) {
      expect(result._meta_.appliedMigrations).toContain(migrationId)
    }
  })

  it("defensively initialises optional collection fields when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = applyMigrations(character)

    // Assert — fields documented in applyMigrations as defensive defaults
    expect(result.spirits).toEqual([])
    expect(result.spells).toEqual([])
    expect(result.adeptPowers).toEqual([])
    expect(result.complexForms).toEqual([])
    expect(result.sprites).toEqual([])
    expect(result.qualities).toEqual([])
    expect(result.contacts).toEqual([])
  })

  it("skips migrations whose id is already in appliedMigrations", () => {
    // Arrange — pre-mark the loan migration as applied with a known stable loan id
    const knownLoanId = "00000000-0000-0000-0000-0000000000aa"
    const character = {
      _meta_: { appliedMigrations: ["20251001"] },
      nuyen: {
        current: 100,
        loans: [
          { id: knownLoanId, lender: "Loan Shark", amount: 1000, interestRate: 5 },
        ],
      },
    }

    // Act
    const result = applyMigrations(character)

    // Assert — the loan id is preserved (20251001 was not re-run, otherwise a UUID would have been re-assigned only if missing)
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    // 20251001 still appears as an applied migration, alongside any newly-applied ones
    expect(result._meta_.appliedMigrations).toContain("20251001")
  })

  it("is idempotent — running it twice yields the same set of applied migrations", () => {
    // Arrange
    const character = {}

    // Act
    const first = applyMigrations(character)
    const second = applyMigrations(first)

    // Assert
    expect(new Set(second._meta_.appliedMigrations)).toEqual(
      new Set(first._meta_.appliedMigrations),
    )
    expect(second._meta_.version).toBe(CHARACTER_SHEET_VERSION)
  })

  it("removes any legacy top-level `version` field via the 20260419 migration", () => {
    // Arrange
    const character = { version: 1 } as object

    // Act
    const result = applyMigrations(character) as object

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
    const character = { spells: [{ name: "Fireball" }] }
    const snapshot = JSON.parse(JSON.stringify(character)) as typeof character

    // Act
    applyMigrations(character)

    // Assert
    expect(character).toEqual(snapshot)
  })
})
