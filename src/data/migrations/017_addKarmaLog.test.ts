import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { KarmaLedgerEntry } from "#/system/karma/karmaLedgerEntry.ts"

import migration from "./017_addKarmaLog.ts"

describe("017_addKarmaLog", () => {
  it("adds an empty log array when the karma object has no log field", () => {
    // Arrange
    const character = { karma: { current: 10, total: 25 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma).toEqual({ current: 10, total: 25, log: [] })
  })

  it("preserves an existing log without overwriting it", () => {
    // Arrange
    const existingLog: KarmaLedgerEntry[] = [{
      id: "00000000-0000-0000-0000-000000000001" as UUID,
      timestamp: "2026-05-21T00:00:00.000Z",
      amount: 5,
      description: "Initial karma",
      source: "addKarma",
    }]
    const character = { karma: { current: 5, total: 5, log: existingLog } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma?.log).toEqual(existingLog)
  })

  it("creates a karma object with an empty log when karma is missing entirely", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma).toEqual({ current: 0, total: 0, log: [] })
  })

  it("does not mutate the input object", () => {
    // Arrange
    const character = { karma: { current: 10, total: 25 } }

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual({ karma: { current: 10, total: 25 } })
  })

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = { _meta_: { version: 17 }, karma: { current: 10, total: 25 } }

    // Act
    const result = migration.up(character)

    // Assert — the log field was not backfilled
    expect(result.karma).not.toHaveProperty("log")
  })
})
