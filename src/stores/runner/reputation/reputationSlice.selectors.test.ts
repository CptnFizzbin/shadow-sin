import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { ReputationSelectors } from "./reputationSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe.concurrent("ReputationSelectors.selectLedger", () => {
  it("returns the runner's reputation ledger", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "Test", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
      ]
    } })

    // Act / Assert
    expect(ReputationSelectors.selectLedger(stateFor(runner))).toBe(runner.reputation.ledger)
  })
})

describe.concurrent("ReputationSelectors.selectStreetCred", () => {
  it("returns the base profile value when the ledger is empty", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 4
    } })

    // Act / Assert
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(4)
  })

  it("adds the sum of ledger entries affecting streetCred to the base value", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 4
      data.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 3, description: "Run", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "streetCred", amount: -1, description: "Correction", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
      ]
    } })

    // Act / Assert: 4 + 3 - 1 = 6
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(6)
  })

  it("ignores ledger entries affecting a different stat", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 4
      data.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "notoriety", amount: 10, description: "Not street cred", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
      ]
    } })

    // Act / Assert
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(4)
  })
})

describe.concurrent("ReputationSelectors.selectNotoriety", () => {
  it("adds the sum of ledger entries affecting notoriety to the base value", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.notoriety = 2
      data.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "notoriety", amount: 5, description: "Betrayal", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
      ]
    } })

    // Act / Assert: 2 + 5 = 7
    expect(ReputationSelectors.selectNotoriety(stateFor(runner))).toBe(7)
  })
})

describe.concurrent("ReputationSelectors.selectPublicAwarenessModifier", () => {
  it("adds the sum of ledger entries affecting publicAwarenessModifier to the base value", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.publicAwarenessModifier = 1
      data.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "publicAwarenessModifier", amount: 2, description: "Public display", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
      ]
    } })

    // Act / Assert: 1 + 2 = 3
    expect(ReputationSelectors.selectPublicAwarenessModifier(stateFor(runner))).toBe(3)
  })

  it("defaults the base modifier to 0 when unset", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ReputationSelectors.selectPublicAwarenessModifier(stateFor(runner))).toBe(0)
  })
})

describe.concurrent("ReputationSelectors.selectPublicAwarenessRating", () => {
  it("computes floor((streetCred + notoriety + modifier) / 3), including ledger adjustments", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 5
      data.profile.notoriety = 2
      data.profile.publicAwarenessModifier = 1
      data.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "Bump", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
      ]
    } })

    // Act / Assert: floor((6 + 2 + 1) / 3) = 3
    expect(ReputationSelectors.selectPublicAwarenessRating(stateFor(runner))).toBe(3)
  })
})

describe.concurrent("ReputationSelectors.selectPublicAwareness", () => {
  it("returns the rating alongside its rank title", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 0
      data.profile.notoriety = 0
      data.profile.publicAwarenessModifier = 0
    } })

    // Act
    const result = ReputationSelectors.selectPublicAwareness(stateFor(runner))

    // Assert
    expect(result.rating).toBe(0)
    expect(result.title).toBe("Nobody")
  })

  it("clamps the rank lookup to the last rank for very high ratings", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 100
      data.profile.notoriety = 100
      data.profile.publicAwarenessModifier = 0
    } })

    // Act
    const result = ReputationSelectors.selectPublicAwareness(stateFor(runner))

    // Assert
    expect(result.title).toBe("Mythical")
  })
})

describe.concurrent("ReputationSelectors.selectAll", () => {
  it("bundles streetCred, notoriety, and awareness together", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.streetCred = 3
      data.profile.notoriety = 1
    } })

    // Act
    const result = ReputationSelectors.selectAll(stateFor(runner))

    // Assert
    expect(result.streetCred).toBe(3)
    expect(result.notoriety).toBe(1)
    expect(result.awareness.rating).toBe(1)
  })
})
