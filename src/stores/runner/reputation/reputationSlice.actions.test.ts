import { describe, expect, it } from "vitest"

import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

import { addReputationEntry, editReputationEntry } from "./reputationSlice.actions.ts"
import { reputationReducer } from "./reputationSlice.ts"

const makeReputation = (overrides: Partial<ReturnType<typeof reputationReducer>> = {}) => ({
  ledger: [],
  ...overrides,
})

describe.concurrent("addReputationEntry", () => {
  it("appends one ledger entry with the given stat, amount, and description", () => {
    // Arrange
    const state = makeReputation()

    // Act
    const next = reputationReducer(state, addReputationEntry(ReputationStatType.streetCred, 3, "Successful run"))

    // Assert
    expect(next.ledger).toHaveLength(1)
    const [entry] = next.ledger
    expect(entry.stat).toBe("streetCred")
    expect(entry.amount).toBe(3)
    expect(entry.description).toBe("Successful run")
    expect(entry.source).toBe("manual")
  })

  it("stamps a UUID id and an ISO timestamp", () => {
    // Arrange
    const state = makeReputation()

    // Act
    const next = reputationReducer(state, addReputationEntry(ReputationStatType.notoriety, -2, "Botched job"))

    // Assert
    const [entry] = next.ledger
    expect(entry.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
    expect(new Date(entry.timestamp).toISOString()).toBe(entry.timestamp)
  })

  it("preserves negative amounts (a decrease)", () => {
    // Arrange
    const state = makeReputation()

    // Act
    const next = reputationReducer(state, addReputationEntry(ReputationStatType.publicAwareness, -1, "Laid low"))

    // Assert
    expect(next.ledger[0].amount).toBe(-1)
  })

  it("preserves existing ledger entries across multiple adds, in call order", () => {
    // Arrange
    let state = makeReputation()

    // Act
    state = reputationReducer(state, addReputationEntry(ReputationStatType.streetCred, 1, "First"))
    state = reputationReducer(state, addReputationEntry(ReputationStatType.notoriety, 2, "Second"))

    // Assert
    expect(state.ledger).toHaveLength(2)
    expect(state.ledger[0].description).toBe("First")
    expect(state.ledger[1].description).toBe("Second")
  })
})

describe.concurrent("editReputationEntry", () => {
  it("updates an existing entry's stat, amount, and description", () => {
    // Arrange
    let state = makeReputation()
    state = reputationReducer(state, addReputationEntry(ReputationStatType.streetCred, 3, "Successful run"))
    const [{ id }] = state.ledger

    // Act
    const next = reputationReducer(state, editReputationEntry(id, ReputationStatType.notoriety, -1, "Actually a botched job"))

    // Assert
    expect(next.ledger).toHaveLength(1)
    const [entry] = next.ledger
    expect(entry.stat).toBe("notoriety")
    expect(entry.amount).toBe(-1)
    expect(entry.description).toBe("Actually a botched job")
  })

  it("leaves the entry's id, timestamp, and source untouched", () => {
    // Arrange
    let state = makeReputation()
    state = reputationReducer(state, addReputationEntry(ReputationStatType.streetCred, 3, "Successful run"))
    const [original] = state.ledger

    // Act
    const next = reputationReducer(state, editReputationEntry(original.id, ReputationStatType.streetCred, 5, "Edited"))

    // Assert
    const [entry] = next.ledger
    expect(entry.id).toBe(original.id)
    expect(entry.timestamp).toBe(original.timestamp)
    expect(entry.source).toBe(original.source)
  })

  it("only edits the matching entry, leaving other entries untouched", () => {
    // Arrange
    let state = makeReputation()
    state = reputationReducer(state, addReputationEntry(ReputationStatType.streetCred, 1, "First"))
    state = reputationReducer(state, addReputationEntry(ReputationStatType.notoriety, 2, "Second"))
    const [first, second] = state.ledger

    // Act
    const next = reputationReducer(state, editReputationEntry(first.id, ReputationStatType.streetCred, 9, "Edited first"))

    // Assert
    expect(next.ledger.find((entry) => entry.id === first.id)?.description).toBe("Edited first")
    expect(next.ledger.find((entry) => entry.id === second.id)).toEqual(second)
  })

  it("does nothing when no entry matches the given id", () => {
    // Arrange
    let state = makeReputation()
    state = reputationReducer(state, addReputationEntry(ReputationStatType.streetCred, 1, "First"))

    // Act
    const next = reputationReducer(state, editReputationEntry("00000000-0000-0000-0000-000000000099", ReputationStatType.notoriety, 5, "Nonexistent"))

    // Assert
    expect(next.ledger).toEqual(state.ledger)
  })
})
