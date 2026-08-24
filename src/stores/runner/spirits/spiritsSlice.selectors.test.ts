import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { SpiritsSelectors } from "./spiritsSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("SpiritsSelectors.selectAll", () => {
  it("returns the runner's spirits", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SpiritsSelectors.selectAll(stateFor(runner))).toBe(runner.spirits)
  })
})
