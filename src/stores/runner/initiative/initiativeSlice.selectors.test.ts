import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { InitiativeSelectors } from "./initiativeSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("InitiativeSelectors.selectPassesCompleted", () => {
  it("returns the completed passes as a set", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.initiative.passesCompleted = [1, 2]
    } })

    // Act / Assert
    expect(InitiativeSelectors.selectPassesCompleted(stateFor(runner))).toEqual(new Set([1, 2]))
  })
})

describe("InitiativeSelectors.selectRolledResults", () => {
  it("returns the rolled results", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.initiative.rolledResults = [4, 3]
    } })

    // Act / Assert
    expect(InitiativeSelectors.selectRolledResults(stateFor(runner))).toEqual([4, 3])
  })
})

describe("InitiativeSelectors.selectGoingFirst", () => {
  it("defaults to false when unset", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(InitiativeSelectors.selectGoingFirst(stateFor(runner))).toBe(false)
  })

  it("returns the stored value", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.initiative.goingFirst = true
    } })

    // Act / Assert
    expect(InitiativeSelectors.selectGoingFirst(stateFor(runner))).toBe(true)
  })
})

describe("InitiativeSelectors.selectExtraPasses", () => {
  it("defaults to 0 when unset", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(InitiativeSelectors.selectExtraPasses(stateFor(runner))).toBe(0)
  })

  it("returns the stored value", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.initiative.extraPasses = 2
    } })

    // Act / Assert
    expect(InitiativeSelectors.selectExtraPasses(stateFor(runner))).toBe(2)
  })
})
