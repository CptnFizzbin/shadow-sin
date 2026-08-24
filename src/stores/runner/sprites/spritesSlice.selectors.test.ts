import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { SpriteSelectors } from "./spritesSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("SpritesSelectors.selectAll", () => {
  it("returns the runner's sprites", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SpriteSelectors.selectAll(stateFor(runner))).toBe(runner.sprites)
  })
})
