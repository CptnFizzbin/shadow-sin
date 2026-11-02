import { describe, expect, it } from "vitest"

import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { EntityScope } from "#/state/entityScope.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

const AGILITY_GROUPS: DiceGroup[] = [{ name: "AGI", size: 4, type: "attribute" }]
const selectAgilityGroups = (_state: EntityScope) => AGILITY_GROUPS
const selectNestedGroups = (_state: EntityScope, { bonus }: { bonus: number }) => [[{ name: "Bonus", size: bonus }], null]

const selectTestPool = createDicePoolSelector({
  id: "test.pool",
  label: "Test Pool",
  groups: [selectAgilityGroups],
})

const selectResistancePool = createDicePoolSelector({
  id: "test.resist",
  label: "Test Resistance",
  groups: [selectAgilityGroups],
  excludeWoundMod: true,
})

describe.concurrent("createDicePoolSelector", () => {
  it("appends a single Wound penalty group when the Runner is wounded", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = selectTestPool(stateFor(runner))

    // Assert
    expect(pool).toEqual({
      id: "test.pool",
      label: "Test Pool",
      groups: [
        { name: "AGI", size: 4, type: "attribute" },
        { name: "Wound", size: -1, type: "penalty" },
      ],
      size: 3,
    })
  })

  it("adds no Wound group when the Runner is unwounded", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const pool = selectTestPool(stateFor(runner))

    // Assert
    expect(pool.groups).toEqual(AGILITY_GROUPS)
    expect(pool.size).toBe(4)
  })

  it("adds no Wound group when the config sets excludeWoundMod", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = selectResistancePool(stateFor(runner))

    // Assert
    expect(pool.groups).toEqual(AGILITY_GROUPS)
    expect(pool.size).toBe(4)
  })

  it("flattens nested group lists and passes options to every group selector", () => {
    // Arrange
    const selectPool = createDicePoolSelector({
      id: "test.nested",
      label: "Test Nested",
      groups: [selectAgilityGroups, selectNestedGroups],
    })
    const runner = runnerDataFactory()

    // Act
    const pool = selectPool(stateFor(runner), { bonus: 2 })

    // Assert
    expect(pool.groups).toEqual([...AGILITY_GROUPS, { name: "Bonus", size: 2 }])
    expect(pool.size).toBe(6)
  })

  it("returns the same pool for repeated calls with the same state", () => {
    // Arrange
    const state = stateFor(runnerDataFactory())

    // Act
    const first = selectTestPool(state)
    const second = selectTestPool(state)

    // Assert
    expect(second).toBe(first)
  })
})
