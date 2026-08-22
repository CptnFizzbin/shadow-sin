import { describe, expect, it } from "vitest"

import { applyMigrations } from "./applyMigrations.ts"
import { CURRENT_RUNNER_VERSION, migrations } from "./migrations.ts"

describe.concurrent("applyMigrations", () => {
  it("stamps the current version when starting from {}", () => {
    // Arrange
    const runner = {}

    // Act
    const result = applyMigrations(runner)

    // Assert
    expect(result._meta_.version).toBe(CURRENT_RUNNER_VERSION)
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
    // Not asserted empty here — migration 023 (addMatrixNode) always backfills a blank flat
    // `matrix` node first, so by the time 025 (addMatrixGameState) runs it always has prior
    // matrix data to convert into knownNodes[0]. See 025_addMatrixGameState.test.ts for the
    // "no prior matrix data" case, exercised by calling that migration's `up` in isolation.
    expect(result.gameState.matrix.knownNodes).toHaveLength(1)
  })

  it("skips migrations already covered by _meta_.version", () => {
    // Arrange — pre-mark migration 3 (addLoanIdAndInterestRate) as applied with a known stable loan id
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

    // Assert — the loan id is preserved (migration 3 was not re-run, otherwise a UUID
    // would have been re-assigned only if missing)
    expect(result.nuyen.loans[0].id).toBe(knownLoanId)
    expect(result._meta_.version).toBe(CURRENT_RUNNER_VERSION)
  })

  it("is idempotent — running it twice yields the same version", () => {
    // Arrange
    const runner = {}

    // Act
    const first = applyMigrations(runner)
    const second = applyMigrations(first)

    // Assert
    expect(second._meta_.version).toBe(first._meta_.version)
    expect(second._meta_.version).toBe(CURRENT_RUNNER_VERSION)
  })

  it("removes any legacy top-level `version` field via migration 007", () => {
    // Arrange
    const runner = { version: 1 } as object

    // Act
    const result = applyMigrations(runner) as object

    // Assert
    expect("version" in result).toBe(false)
  })

  it("runs migrations in ascending version order", () => {
    // Arrange — call sites depend on this ordering invariant
    const sortedVersions = [...migrations].map((m) => m.version).sort((a, b) => a - b)

    // Act
    const actualVersions = migrations.map((m) => m.version)

    // Assert
    expect(actualVersions).toEqual(sortedVersions)
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
