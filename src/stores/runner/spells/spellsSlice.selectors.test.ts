import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { SpellsSelectors } from "./spellsSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("SpellsSelectors.selectAll", () => {
  it("returns the runner's spells", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SpellsSelectors.selectAll(stateFor(runner))).toBe(runner.spells)
  })
})
