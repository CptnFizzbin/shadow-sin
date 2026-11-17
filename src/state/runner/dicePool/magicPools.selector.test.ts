import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SpellCategory } from "#/system/model/magic/spellData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import { loadMouse } from "#testUtils/fixtures/characters/mouse.ts"

import { MagicPoolSelectors } from "./magicPools.selector.ts"

describe.concurrent("MagicPoolSelectors.selectDrainResistanceTest", () => {
  it("leaves out the Wound Modifier, since Drain Resistance is a Resistance Test", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = MagicPoolSelectors.selectDrainResistanceTest(
      { runner, entity: runner, items: getItemCatalog(runner) },
      { attr: AttributeKey.logic },
    )

    // Assert
    expect(pool.groups).not.toContainEqual({ name: "Wound", size: -1, type: "penalty" })
  })
})

describe.concurrent("MagicPoolSelectors.selectSpellcastingTest", () => {
  const mouseState = () => {
    const runner = loadMouse()
    return { runner, entity: runner, items: getItemCatalog(runner) }
  }

  it("adds Mouse's Combat Spells Specialization and Combat Spellcasting Focus when casting a Combat spell", () => {
    // Arrange
    const state = mouseState()

    // Act
    const pool = MagicPoolSelectors.selectSpellcastingTest(state, { spellCategory: SpellCategory.Combat })

    // Assert
    expect(pool.groups.map(({ name, size }) => [name, size])).toEqual([
      ["MAG", 6],
      ["Spellcasting", 6],
      ["Specialization: Combat Spells", 2],
      ["Spellcasting Focus", 4],
      ["Wound", -1],
    ])
    expect(pool.size).toBe(17)
  })

  it("adds neither when Mouse casts a Health spell", () => {
    // Arrange
    const state = mouseState()

    // Act
    const pool = MagicPoolSelectors.selectSpellcastingTest(state, { spellCategory: SpellCategory.Health })

    // Assert
    expect(pool.groups.map(({ name }) => name)).toEqual(["MAG", "Spellcasting", "Wound"])
    expect(pool.size).toBe(11)
  })
})
