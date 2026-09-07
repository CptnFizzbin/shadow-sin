import { describe, expect, it } from "vitest"

import { ReputationUtils } from "#/system/reputation/createLedgerEntry.ts"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { ReputationSelectors } from "./reputationSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe.concurrent("ReputationSelectors.selectLedger", () => {
  it("returns the runner's reputation ledger", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.reputation.ledger = [
          {
            id: "00000000-0000-0000-0000-000000000001",
            stat: ReputationStatType.streetCred,
            amount: 1,
            description: "Test",
            timestamp: "2026-01-01T00:00:00Z",
            source: "manual",
          },
        ]
      },
    })

    // Act / Assert
    expect(ReputationSelectors.selectLedger(stateFor(runner))).toBe(runner.reputation.ledger)
  })
})

describe.concurrent("ReputationSelectors.selectStreetCred", () => {
  it("returns floor(total karma / 10) when the ledger is empty", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 45
      },
    })

    // Act / Assert: floor(45 / 10) = 4
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(4)
  })

  it("adds the sum of ledger entries affecting streetCred to the karma-derived base value", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 45
        data.reputation.ledger = [
          {
            id: "00000000-0000-0000-0000-000000000001",
            stat: ReputationStatType.streetCred,
            amount: 3,
            description: "Run",
            timestamp: "2026-01-01T00:00:00Z",
            source: "manual",
          },
          {
            id: "00000000-0000-0000-0000-000000000002",
            stat: ReputationStatType.streetCred,
            amount: -1,
            description: "Correction",
            timestamp: "2026-01-02T00:00:00Z",
            source: "manual",
          },
        ]
      },
    })

    // Act / Assert: floor(45 / 10) + 3 - 1 = 4 + 3 - 1 = 6
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(6)
  })

  it("ignores ledger entries affecting a different stat", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 45
        data.reputation.ledger = [
          {
            id: "00000000-0000-0000-0000-000000000001",
            stat: ReputationStatType.notoriety,
            amount: 10,
            description: "Not street cred",
            timestamp: "2026-01-01T00:00:00Z",
            source: "manual",
          },
        ]
      },
    })

    // Act / Assert
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(4)
  })

  it("rounds down rather than to the nearest ten", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 19
      },
    })

    // Act / Assert: floor(19 / 10) = 1
    expect(ReputationSelectors.selectStreetCred(stateFor(runner))).toBe(1)
  })
})

describe.concurrent("ReputationSelectors.selectNotoriety", () => {
  it("sums the ledger entries affecting notoriety", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.reputation.ledger = [
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.notoriety, amount: 2, description: "Bump" }),
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.publicAwareness, amount: 5, description: "Betrayal" }),
        ]
      },
    })

    // Act / Assert: only the notoriety entry counts
    expect(ReputationSelectors.selectNotoriety(stateFor(runner))).toBe(2)
  })
})

describe.concurrent("ReputationSelectors.selectPublicAwareness", () => {
  it("adds the sum of ledger entries affecting publicAwareness to the base value", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.reputation.ledger = [
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.publicAwareness, amount: 1, description: "Bump" }),
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.publicAwareness, amount: 2, description: "Public display" }),
        ]
      },
    })

    // Act / Assert: 1 + 2 = 3
    expect(ReputationSelectors.selectPublicAwareness(stateFor(runner))).toBe(3)
  })

  it("defaults the base modifier to 0 when unset", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ReputationSelectors.selectPublicAwareness(stateFor(runner))).toBe(0)
  })
})

describe.concurrent("ReputationSelectors.selectPublicAwarenessRating", () => {
  it("computes floor((streetCred + notoriety + modifier) / 3), including ledger adjustments", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 50
        data.reputation.ledger = [
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.notoriety, amount: 2, description: "Bump" }),
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.publicAwareness, amount: 1, description: "Bump" }),
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.streetCred, amount: 1, description: "Bump" }),
        ]
      },
    })

    // Act / Assert: streetCred = floor(50 / 10) + 1 = 6; floor((6 + 2 + 1) / 3) = 3
    expect(ReputationSelectors.selectPublicAwarenessRating(stateFor(runner))).toBe(3)
  })
})

describe.concurrent("ReputationSelectors.selectPublicAwarenessInfo", () => {
  it("returns the rating alongside its rank title", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = ReputationSelectors.selectPublicAwarenessInfo(stateFor(runner))

    // Assert
    expect(result.rating).toBe(0)
    expect(result.title).toBe("Nobody")
  })

  it("clamps the rank lookup to the last rank for very high ratings", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 1000
        data.reputation.ledger = [
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.notoriety, amount: 100, description: "testing" }),
        ]
      },
    })

    // Act
    const result = ReputationSelectors.selectPublicAwarenessInfo(stateFor(runner))

    // Assert
    expect(result.title).toBe("Mythical")
  })
})

describe.concurrent("ReputationSelectors.selectAll", () => {
  it("bundles streetCred, notoriety, and awareness together", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.karma.total = 30
        data.reputation.ledger = [
          ReputationUtils.createLedgerEntry({ stat: ReputationStatType.notoriety, amount: 1, description: "testing" }),
        ]
      },
    })

    // Act
    const result = ReputationSelectors.selectAll(stateFor(runner))

    // Assert
    expect(result.streetCred).toBe(3)
    expect(result.notoriety).toBe(1)
    expect(result.awareness).toBe(1)
  })
})
