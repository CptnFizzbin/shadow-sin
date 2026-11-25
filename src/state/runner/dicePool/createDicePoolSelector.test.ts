import { describe, expect, it } from "vitest"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { FocusData } from "#/data/items/magicalData.ts"
import { MagicalType } from "#/data/items/magicalData.ts"
import { FocusType } from "#/data/magic/focusData.ts"
import type { SpellData } from "#/data/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/data/magic/spellData.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { getItemCatalog } from "#/data/runner/runnerTraits.ts"
import type { DiceGroup } from "#/rules/dicePool/diceGroup.tsx"
import type { EntityScope } from "#/state/entityScope.ts"

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

const sustainedSpell = (id: string): SpellData => ({
  kind: EntityKind.spell,
  id,
  name: "Armor",
  type: SpellType.Physical,
  range: SpellRange.LoS,
  damage: SpellDamage.Physical,
  category: SpellCategory.Manipulation,
  drain: { type: SpellDrainType.Force, value: 2 },
  dealsDamage: false,
  duration: SpellDuration.Sustained,
  voluntaryTargetsOnly: false,
  sustained: true,
})

const sustainingRunner = () => runnerDataFactory({ afterBuild: (s) => {
  s.spells = [sustainedSpell(crypto.randomUUID()), sustainedSpell(crypto.randomUUID())]
} })

describe.concurrent("createDicePoolSelector sustaining penalty", () => {
  it("appends a Sustaining penalty for the spells the Runner sustains", () => {
    // Arrange
    const runner = sustainingRunner()

    // Act
    const pool = selectTestPool(stateFor(runner))

    // Assert
    expect(pool.groups).toEqual([...AGILITY_GROUPS, { name: "Sustaining", size: -4, type: "penalty" }])
    expect(pool.size).toBe(1)
  })

  it("leaves out a spell held by a Bonded Sustaining Focus", () => {
    // Arrange
    const focusId = crypto.randomUUID() as UUID
    const focus: FocusData = {
      kind: EntityKind.item,
      id: focusId,
      name: "Sustaining Focus",
      itemType: ItemType.magical,
      magicalType: MagicalType.focus,
      focusType: FocusType.Sustaining,
      force: 3,
      spellCategory: SpellCategory.Manipulation,
      bonded: true,
      state: ItemState.available,
      items: { parentId: null, childIds: [] },
    }
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.spells = [
        { ...sustainedSpell(crypto.randomUUID()), sustainedBy: focusId },
        sustainedSpell(crypto.randomUUID()),
      ]
      s._data_.items[focusId] = focus
    } })

    // Act
    const pool = selectTestPool(stateFor(runner))

    // Assert
    expect(pool.groups).toEqual([...AGILITY_GROUPS, { name: "Sustaining", size: -2, type: "penalty" }])
  })

  it("adds no Sustaining group when the config sets excludeSustainingPenalty", () => {
    // Arrange
    const selectPool = createDicePoolSelector({
      id: "test.other",
      label: "Test Rolled By Another",
      groups: [selectAgilityGroups],
      excludeSustainingPenalty: true,
    })
    const runner = sustainingRunner()

    // Act
    const pool = selectPool(stateFor(runner))

    // Assert
    expect(pool.groups).toEqual(AGILITY_GROUPS)
  })
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
