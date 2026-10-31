import { describe, expect, it } from "vitest"

import { selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

const selectTestPool = createDicePoolSelector(
  selectorOption<{ excludeWoundMod: boolean }>("excludeWoundMod"),
  (excludeWoundMod) => ({
    id: "test.pool",
    label: "Test Pool",
    excludeWoundMod,
    groups: [{ name: "AGI", size: 4, type: "attribute" as const }],
  }),
)

describe.concurrent("createDicePoolSelector", () => {
  it("appends a single Wound penalty group when the Runner is wounded", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = selectTestPool(stateFor(runner), { excludeWoundMod: false })

    // Assert
    expect(pool.groups).toEqual([
      { name: "AGI", size: 4, type: "attribute" },
      { name: "Wound", size: -1, type: "penalty" },
    ])
    expect(pool.size).toBe(3)
  })

  it("adds no Wound group when the Runner is unwounded", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const pool = selectTestPool(stateFor(runner), { excludeWoundMod: false })

    // Assert
    expect(pool.groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
    expect(pool.size).toBe(4)
  })

  it("adds no Wound group when the config sets excludeWoundMod", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = selectTestPool(stateFor(runner), { excludeWoundMod: true })

    // Assert
    expect(pool.groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
    expect(pool.size).toBe(4)
  })

  it("returns the same pool for repeated calls with the same state and options", () => {
    // Arrange
    const runner = runnerDataFactory()
    const options = { excludeWoundMod: false }

    // Act
    const first = selectTestPool(stateFor(runner), options)
    const second = selectTestPool(stateFor(runner), options)

    // Assert
    expect(second).toBe(first)
  })
})
