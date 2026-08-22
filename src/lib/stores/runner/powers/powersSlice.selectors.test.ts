import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { PowersSelectors, selectPowers } from "./powersSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectPowers", () => {
  it("returns the runner's powers", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectPowers(runner)).toBe(runner.powers)
  })
})

describe("PowersSelectors.selectAll", () => {
  it("returns the runner's powers", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(PowersSelectors.selectAll(stateFor(runner))).toBe(runner.powers)
  })
})
