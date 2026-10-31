import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { ArmorRatingType } from "#/system/model/items/armorData.ts"
import { createItem, createItemMap } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

import { CombatPoolSelectors } from "./combatPools.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

const woundedRunner = () => runnerDataFactory({ afterBuild: (s) => {
  s.damage.physical = 3
} })

const wound = { name: "Wound", size: -1, type: "penalty" }

describe.concurrent("CombatPoolSelectors Resistance Tests", () => {
  it("leaves the Wound Modifier out of damage resistance", () => {
    // Arrange
    const runner = woundedRunner()

    // Act
    const pool = CombatPoolSelectors.selectResistDamageTest(
      stateFor(runner),
      { damageType: "P", armor: ArmorRatingType.ballistic },
    )

    // Assert
    expect(pool.groups).not.toContainEqual(wound)
  })

  it("leaves the Wound Modifier out of direct spell resistance", () => {
    // Arrange
    const runner = woundedRunner()

    // Act
    const pool = CombatPoolSelectors.selectResistManaSpellTest(stateFor(runner))

    // Assert
    expect(pool.groups).not.toContainEqual(wound)
  })
})

describe.concurrent("CombatPoolSelectors defense tests", () => {
  it("includes the Wound Modifier in a defense test", () => {
    // Arrange
    const runner = woundedRunner()

    // Act
    const pool = CombatPoolSelectors.selectRangedDefenseTest(stateFor(runner))

    // Assert
    expect(pool.groups).toContainEqual(wound)
  })

  it("applies Encumbrance through the Reaction Rating rather than a separate group", () => {
    // Arrange
    const [armor] = createItem<ArmorData>({
      name: "Heavy Armor",
      itemType: ItemType.armor,
      equipped: true,
      ballistic: 10,
      impact: 6,
    })
    const runner = runnerDataFactory({
      items: createItemMap([armor]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 3
        s.attributes[AttributeKey.reaction] = 4
      },
    })

    // Act
    const pool = CombatPoolSelectors.selectRangedDefenseTest(stateFor(runner))

    // Assert
    expect(pool.groups).toEqual([
      { name: "REA", size: 2, type: "attribute", modifiers: [{ name: "Encumbrance", value: -2 }] },
    ])
  })
})
