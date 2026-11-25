import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ArmorData } from "#/data/items/armorData.ts"
import { ArmorRatingType } from "#/data/items/armorData.ts"
import { createItem, createItemMap } from "#/data/items/itemData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
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
import { SkillKey } from "#/data/skills/skillKey.ts"
import { loadMouse } from "#testUtils/fixtures/characters/mouse.ts"

import { CombatPoolSelectors } from "./combatPools.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

const woundedRunner = () => runnerDataFactory({ afterBuild: (s) => {
  s.damage.physical = 3
} })

const wound = { name: "Wound", size: -1, type: "penalty" }

const sustainingRunner = () => runnerDataFactory({ afterBuild: (s) => {
  s.spells = [{
    kind: EntityKind.spell,
    id: crypto.randomUUID(),
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
  }]
} })

const sustaining = { name: "Sustaining", size: -2, type: "penalty" }

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

describe.concurrent("CombatPoolSelectors damage resistance and the Sustaining penalty", () => {
  it("leaves the Sustaining penalty out of damage resistance", () => {
    // Arrange
    const runner = sustainingRunner()

    // Act
    const pool = CombatPoolSelectors.selectResistDamageTest(
      stateFor(runner),
      { damageType: "P", armor: ArmorRatingType.ballistic },
    )

    // Assert
    expect(pool.groups).not.toContainEqual(sustaining)
  })

  it("leaves the Sustaining penalty out of the Defense Calculator's damage resistance", () => {
    // Arrange
    const runner = sustainingRunner()

    // Act
    const pool = CombatPoolSelectors.selectDefenseCalculatorResistTest(
      stateFor(runner),
      { attr: AttributeKey.body, armor: ArmorRatingType.ballistic },
    )

    // Assert
    expect(pool.groups).not.toContainEqual(sustaining)
  })

  it("includes the Sustaining penalty in a defense test", () => {
    // Arrange
    const runner = sustainingRunner()

    // Act
    const pool = CombatPoolSelectors.selectRangedDefenseTest(stateFor(runner))

    // Assert
    expect(pool.groups).toContainEqual(sustaining)
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
      state: ItemState.equipped,
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
      {
        name: "REA",
        size: 2,
        type: "attribute",
        breakdown: { rawValue: 4, modifiers: [{ name: "Encumbrance", value: -2 }], rating: 2 },
      },
    ])
  })
})

describe.concurrent("CombatPoolSelectors combat spell defense", () => {
  const mouseWithCounterspellingSpecialization = (specialization: string) => {
    const mouse = loadMouse()
    const runner = {
      ...mouse,
      skills: {
        ...mouse.skills,
        activeSkills: mouse.skills.activeSkills.map((skill) =>
          skill.name === SkillKey.counterspelling ? { ...skill, specialization } : skill),
      },
    }
    return { runner, entity: runner, items: getItemCatalog(runner) }
  }

  it("adds a Counterspelling Specialization covering Combat spells", () => {
    // Arrange
    const state = mouseWithCounterspellingSpecialization("Combat Spells")

    // Act
    const pool = CombatPoolSelectors.selectManaSpellDefenseTest(state)

    // Assert
    expect(pool.groups.map(({ name, size }) => [name, size])).toEqual([
      ["WIL", 7],
      ["Counterspelling", 5],
      ["Specialization: Combat Spells", 2],
      ["Wound", -1],
    ])
  })

  it("leaves out a Counterspelling Specialization for another spell category", () => {
    // Arrange
    const state = mouseWithCounterspellingSpecialization("Health Spells")

    // Act
    const pool = CombatPoolSelectors.selectManaSpellDefenseTest(state)

    // Assert
    expect(pool.groups.map(({ name }) => name)).toEqual(["WIL", "Counterspelling", "Wound"])
  })
})
