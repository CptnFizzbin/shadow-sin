import { describe, expect, it } from "vitest"

import migration from "./20260827_00_addReputationLedger.ts"

describe.concurrent("addReputationLedger", () => {
  it("adds an empty ledger when reputation is entirely missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation).toEqual({ ledger: [] })
  })

  it("adds an empty ledger when reputation exists but has no ledger field", () => {
    // Arrange
    const character = { reputation: {} }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation).toEqual({ ledger: [] })
  })

  it("leaves an existing ledger untouched", () => {
    // Arrange
    const existingLedger = [
      { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "Prior entry", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
    ]
    const character = { reputation: { ledger: existingLedger } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toEqual(existingLedger)
  })

  it("is idempotent — running it twice produces the same result", () => {
    // Arrange
    const character = {}

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert
    expect(twice).toEqual(once)
  })
})
