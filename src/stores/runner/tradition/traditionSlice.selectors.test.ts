import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { TraditionSelectors } from "./traditionSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("TraditionSelectors.select", () => {
  it("returns the runner's tradition", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(TraditionSelectors.select(stateFor(runner))).toBe(runner.tradition)
  })
})
