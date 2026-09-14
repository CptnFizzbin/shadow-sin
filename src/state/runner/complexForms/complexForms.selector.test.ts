import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { ComplexFormsSelectors } from "./complexForms.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("ComplexFormsSelectors.selectAll", () => {
  it("returns the runner's complex forms", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ComplexFormsSelectors.selectAll(stateFor(runner))).toBe(runner.complexForms)
  })
})
