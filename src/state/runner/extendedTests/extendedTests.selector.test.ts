import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { ExtendedTestsSelectors } from "./extendedTests.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("ExtendedTestsSelectors.selectAll", () => {
  it("returns the runner's extended tests", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ExtendedTestsSelectors.selectAll(stateFor(runner))).toBe(runner.extendedTests)
  })
})
