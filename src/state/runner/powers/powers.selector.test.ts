import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { PowersSelectors } from "./powers.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("PowersSelectors.selectAll", () => {
  it("returns the runner's powers", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(PowersSelectors.selectAll(stateFor(runner))).toBe(runner.powers)
  })
})
