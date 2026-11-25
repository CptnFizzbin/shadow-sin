import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"

import { SpellsSelectors } from "./spells.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("SpellsSelectors.selectAll", () => {
  it("returns the runner's spells", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SpellsSelectors.selectAll(stateFor(runner))).toBe(runner.spells)
  })
})
