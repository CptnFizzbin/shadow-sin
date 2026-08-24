import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { KarmaSelectors, selectCurrentKarma, selectKarma, selectTotalKarma } from "./karmaSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectKarma", () => {
  it("returns the runner's karma record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectKarma(runner)).toBe(runner.karma)
  })
})

describe("selectCurrentKarma", () => {
  it("returns the runner's current karma", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.karma.current = 5
      return s
    } })

    // Act / Assert
    expect(selectCurrentKarma(runner)).toBe(5)
  })
})

describe("selectTotalKarma", () => {
  it("returns the runner's total karma", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.karma.total = 20
      return s
    } })

    // Act / Assert
    expect(selectTotalKarma(runner)).toBe(20)
  })
})

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
    const runner = runnerDataFactory({ override: (s) => {
      s.karma.current = 5
      return s
    } })

    // Act / Assert
    expect(KarmaSelectors.selectCurrent(stateFor(runner))).toBe(5)
  })
})

describe("KarmaSelectors.selectTotal", () => {
  it("returns the runner's total karma", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.karma.total = 20
      return s
    } })

    // Act / Assert
    expect(KarmaSelectors.selectTotal(stateFor(runner))).toBe(20)
  })
})
