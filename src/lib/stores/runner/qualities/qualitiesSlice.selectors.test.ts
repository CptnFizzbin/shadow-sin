import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { QualitiesSelectors } from "./qualitiesSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("QualitiesSelectors.selectAll", () => {
  it("returns the runner's qualities", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(QualitiesSelectors.selectAll(stateFor(runner))).toBe(runner.qualities)
  })
})
