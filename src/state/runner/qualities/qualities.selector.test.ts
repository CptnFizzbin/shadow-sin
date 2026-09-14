import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { QualitiesSelectors } from "./qualities.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("QualitiesSelectors.selectAll", () => {
  it("returns the runner's qualities", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(QualitiesSelectors.selectAll(stateFor(runner))).toBe(runner.qualities)
  })
})
