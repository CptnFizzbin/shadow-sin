import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"

import { TraditionSelectors } from "./tradition.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("TraditionSelectors.select", () => {
  it("returns the runner's tradition", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(TraditionSelectors.select(stateFor(runner))).toBe(runner.tradition)
  })
})
