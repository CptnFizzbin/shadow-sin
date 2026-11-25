import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"

import { KarmaSelectors } from "./karma.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("KarmaSelectors.select", () => {
  it("returns the runner's karma record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(KarmaSelectors.select(stateFor(runner))).toBe(runner.karma)
  })
})

describe("KarmaSelectors.selectCurrent", () => {
  it("returns the runner's current karma", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.karma.current = 5
    } })

    // Act / Assert
    expect(KarmaSelectors.selectCurrent(stateFor(runner))).toBe(5)
  })
})

describe("KarmaSelectors.selectTotal", () => {
  it("returns the runner's total karma", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.karma.total = 20
    } })

    // Act / Assert
    expect(KarmaSelectors.selectTotal(stateFor(runner))).toBe(20)
  })
})

describe("KarmaSelectors.selectExchange", () => {
  it("returns the default exchange House Rules: buying on at 5000¥, selling off at 2500¥", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = KarmaSelectors.selectExchange(stateFor(runner))

    // Assert
    expect(result).toEqual({
      buy: { enabled: true, nuyenPerKarma: 5000 },
      sell: { enabled: false, nuyenPerKarma: 2500 },
    })
  })

  it("applies the Runner's stored overrides", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (draft) => {
      draft._data_.featureFlags = {
        "houseRules.karma.buy.enabled": false,
        "houseRules.karma.sell.enabled": true,
        "houseRules.karma.sell.nuyenPerKarma": 1000,
      }
    } })

    // Act
    const result = KarmaSelectors.selectExchange(stateFor(runner))

    // Assert
    expect(result).toEqual({
      buy: { enabled: false, nuyenPerKarma: 5000 },
      sell: { enabled: true, nuyenPerKarma: 1000 },
    })
  })
})
