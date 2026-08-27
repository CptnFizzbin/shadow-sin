import { describe, expect, it } from "vitest"

import { addReputationEntry } from "./reputationSlice.actions.ts"
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
    const next = reputationReducer(state, addReputationEntry("streetCred", 3, "Successful run"))

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
    const next = reputationReducer(state, addReputationEntry("notoriety", -2, "Botched job"))

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
    const next = reputationReducer(state, addReputationEntry("publicAwarenessModifier", -1, "Laid low"))

    // Assert
    expect(next.ledger[0].amount).toBe(-1)
  })

  it("preserves existing ledger entries across multiple adds, in call order", () => {
    // Arrange
    let state = makeReputation()

    // Act
    state = reputationReducer(state, addReputationEntry("streetCred", 1, "First"))
    state = reputationReducer(state, addReputationEntry("notoriety", 2, "Second"))

    // Assert
    expect(state.ledger).toHaveLength(2)
    expect(state.ledger[0].description).toBe("First")
    expect(state.ledger[1].description).toBe("Second")
  })
})
