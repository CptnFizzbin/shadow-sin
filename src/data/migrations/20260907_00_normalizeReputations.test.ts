import { describe, expect, it } from "vitest"

import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

import migration from "./20260907_00_normalizeReputations.ts"

describe.concurrent("normalizeReputations", () => {
  it("initializes the ledger and backfills it when reputation is entirely missing", () => {
    // Arrange
    const character = { profile: { streetCred: 5, notoriety: 3, publicAwarenessModifier: 2 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger.map((entry) => entry.stat)).toEqual(["streetCred", "notoriety", "publicAwareness"])
  })

  it("initializes the ledger and backfills it when reputation exists but has no ledger field", () => {
    // Arrange — a legacy shape that predates the ledger's introduction
    const character = { profile: { streetCred: 5 }, reputation: {} } as unknown as Parameters<typeof migration.up>[0]

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toHaveLength(1)
    expect(result.reputation?.ledger[0]).toMatchObject({ stat: "streetCred", amount: 5 })
  })

  it("leaves an already-populated ledger untouched", () => {
    // Arrange
    const existingLedger = [
      { id: "00000000-0000-0000-0000-000000000001", stat: ReputationStatType.streetCred, amount: 1, description: "Prior entry", timestamp: "2026-01-01T00:00:00Z" },
    ]
    const character = {
      profile: { streetCred: 5, notoriety: 3, publicAwarenessModifier: 2 },
      reputation: { ledger: existingLedger },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toEqual(existingLedger)
  })

  it("backfills a streetCred entry from the legacy profile field", () => {
    // Arrange
    const character = { profile: { streetCred: 5 }, reputation: { ledger: [] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toHaveLength(1)
    expect(result.reputation?.ledger[0]).toMatchObject({
      stat: "streetCred",
      amount: 5,
      description: "Legacy import",
    })
  })

  it("backfills a notoriety entry from the legacy profile field", () => {
    // Arrange
    const character = { profile: { notoriety: 3 }, reputation: { ledger: [] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toHaveLength(1)
    expect(result.reputation?.ledger[0]).toMatchObject({
      stat: "notoriety",
      amount: 3,
      description: "Legacy import",
    })
  })

  it("backfills a publicAwareness entry from the legacy profile field", () => {
    // Arrange
    const character = { profile: { publicAwarenessModifier: 2 }, reputation: { ledger: [] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toHaveLength(1)
    expect(result.reputation?.ledger[0]).toMatchObject({
      stat: "publicAwareness",
      amount: 2,
      description: "Legacy import",
    })
  })

  it("backfills one entry per non-zero legacy field, each with its own id and timestamp", () => {
    // Arrange
    const character = {
      profile: { streetCred: 5, notoriety: 3, publicAwarenessModifier: 2 },
      reputation: { ledger: [] },
    }

    // Act
    const result = migration.up(character)

    // Assert
    const ledger = result.reputation!.ledger
    expect(ledger).toHaveLength(3)
    expect(ledger.map((entry) => entry.stat)).toEqual(["streetCred", "notoriety", "publicAwareness"])
    expect(ledger.map((entry) => entry.amount)).toEqual([5, 3, 2])
    // Every entry gets its own generated id and an ISO timestamp
    const ids = new Set(ledger.map((entry) => entry.id))
    expect(ids.size).toBe(3)
    for (const entry of ledger) {
      expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    }
  })

  it("treats a missing profile as all legacy fields being 0", () => {
    // Arrange
    const character = { reputation: { ledger: [] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toEqual([])
  })

  it("skips fields left at their default of 0", () => {
    // Arrange
    const character = {
      profile: { streetCred: 0, notoriety: 0, publicAwarenessModifier: 0 },
      reputation: { ledger: [] },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toEqual([])
  })

  it("skips negative legacy values rather than importing them", () => {
    // Arrange
    const character = {
      profile: { streetCred: -2, notoriety: -1, publicAwarenessModifier: -3 },
      reputation: { ledger: [] },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.reputation?.ledger).toEqual([])
  })

  it("is idempotent — running it twice produces the same result", () => {
    // Arrange
    const character = {
      profile: { streetCred: 5, notoriety: 3, publicAwarenessModifier: 2 },
      reputation: { ledger: [] },
    }

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert
    expect(twice).toEqual(once)
  })
})
