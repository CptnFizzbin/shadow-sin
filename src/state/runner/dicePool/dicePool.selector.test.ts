import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { ArmorRatingType } from "#/system/model/items/armorData.ts"
import { createItem, createItemMap } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { DicePoolSelectors } from "./dicePool.selector.ts"

/** `DicePoolSelectors`' `TState` — `{ runner, entity, items }` — is exactly what
 *  `useRunnerSelector` assembles from a `RunnerData` alone; tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("DicePoolSelectors.selectAttrTest", () => {
  it("returns just the base Attribute rating", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.agility] = 4
    } })

    // Act
    const groups = DicePoolSelectors.selectAttrTest(stateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
  })

  it("ignores active attrMod GameEffects targeting the attribute", () => {
    // Arrange
    const [implant] = createItem({
      name: "Muscle Augmentation",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 2 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
      },
    })

    // Act
    const groups = DicePoolSelectors.selectAttrTest(stateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
  })
})

describe("DicePoolSelectors.selectSkillTest", () => {
  it("returns the base Skill rating when trained", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
    } })

    // Act
    const groups = DicePoolSelectors.selectSkillTest(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{ name: SkillKey.pistols, size: 3, type: "skill" }])
  })

  it("defaults to a -1 Defaulting penalty when untrained and defaultable", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DicePoolSelectors.selectSkillTest(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{ name: `${SkillKey.pistols} - Defaulting`, size: -1, type: "defaulting" }])
  })

  it("rolls a flat 0 instead of Defaulting when untrained and not defaultable", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DicePoolSelectors.selectSkillTest(stateFor(runner), { skill: SkillKey.arcana })

    // Assert
    expect(groups).toEqual([{ name: SkillKey.arcana, size: 0, type: "skill" }])
  })

  it("rolls a flat 0 instead of Defaulting when untrained and excludeDefaulting is set", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DicePoolSelectors.selectSkillTest(
      stateFor(runner),
      { skill: SkillKey.pistols, excludeDefaulting: true },
    )

    // Assert
    expect(groups).toEqual([{ name: SkillKey.pistols, size: 0, type: "skill" }])
  })

  it("adds the flat Specialization bonus when isSpecialized is set", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3, specialization: "Semi-Automatics" }]
    } })

    // Act
    const groups = DicePoolSelectors.selectSkillTest(
      stateFor(runner),
      { skill: SkillKey.pistols, isSpecialized: true },
    )

    // Assert
    expect(groups).toEqual([
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: `${SkillKey.pistols} Mod`, size: 2, type: "bonus" },
    ])
  })

  it("adds a combined mod entry from active skillMod GameEffects targeting the skill", () => {
    // Arrange
    const [focus] = createItem({
      name: "Smartlink",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.skillMod, target: SkillKey.pistols, value: 2 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([focus]),
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      },
    })

    // Act
    const groups = DicePoolSelectors.selectSkillTest(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: `${SkillKey.pistols} Mod`, size: 2, type: "bonus" },
    ])
  })
})

describe("DicePoolSelectors.selectStandardTest", () => {
  it("assembles Base Attribute, Base Skill, and Skill mod(s) in order", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3, specialization: "Semi-Automatics" }]
      },
    })

    // Act
    const pool = DicePoolSelectors.selectStandardTest(
      stateFor(runner),
      { attr: AttributeKey.agility, skill: SkillKey.pistols, isSpecialized: true },
    )

    // Assert
    expect(pool.groups).toEqual([
      { name: "AGI", size: 4, type: "attribute" },
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: `${SkillKey.pistols} Mod`, size: 2, type: "bonus" },
    ])
    expect(pool.size).toBe(4 + 3 + 2)
  })
})

describe("DicePoolSelectors.selectAttrGroup", () => {
  it("returns the Attribute's rating as one group", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.charisma] = 5
    } })

    // Act
    const group = DicePoolSelectors.selectAttrGroup(stateFor(runner), { attr: AttributeKey.charisma })

    // Assert
    expect(group).toEqual({ name: "CHA", size: 5, type: "attribute" })
  })

  it("returns the same reference for equal options passed as a new object", () => {
    // Arrange
    const state = stateFor(runnerDataFactory())

    // Act
    const first = DicePoolSelectors.selectAttrGroup(state, { attr: AttributeKey.charisma })
    const second = DicePoolSelectors.selectAttrGroup(state, { attr: AttributeKey.charisma })

    // Assert
    expect(second).toBe(first)
  })
})

describe("DicePoolSelectors.selectActiveSkillGroup", () => {
  it("folds active skillMod GameEffects into a trained skill's rating", () => {
    // Arrange
    const [implant] = createItem({
      name: "Reflex Recorder",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.skillMod, target: SkillKey.pistols, value: 1 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      },
    })

    // Act
    const group = DicePoolSelectors.selectActiveSkillGroup(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(group).toEqual({ name: SkillKey.pistols, size: 4, type: "skill" })
  })

  it("returns a Defaulting penalty when untrained", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const group = DicePoolSelectors.selectActiveSkillGroup(stateFor(runner), { skill: SkillKey.dodge })

    // Assert
    expect(group).toEqual({ name: `${SkillKey.dodge} - Defaulting`, size: -1, type: "defaulting" })
  })

  it("returns a flat 0 when untrained and excludeDefaulting is set", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const group = DicePoolSelectors.selectActiveSkillGroup(
      stateFor(runner),
      { skill: SkillKey.counterspelling, excludeDefaulting: true },
    )

    // Assert
    expect(group).toEqual({ name: SkillKey.counterspelling, size: 0, type: "skill" })
  })
})

describe("DicePoolSelectors.selectWoundGroup", () => {
  it("returns null when uninjured", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const group = DicePoolSelectors.selectWoundGroup(stateFor(runner))

    // Assert
    expect(group).toBeNull()
  })

  it("returns the Wound Modifier as a penalty", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const group = DicePoolSelectors.selectWoundGroup(stateFor(runner))

    // Assert
    expect(group).toEqual({ name: "Wound", size: -1, type: "penalty" })
  })
})

describe("DicePoolSelectors.selectEncumbranceGroup", () => {
  it("returns null when unencumbered", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const group = DicePoolSelectors.selectEncumbranceGroup(stateFor(runner))

    // Assert
    expect(group).toBeNull()
  })

  it("returns the Encumbrance penalty when worn armor exceeds Body x 2", () => {
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
      },
    })

    // Act
    const group = DicePoolSelectors.selectEncumbranceGroup(stateFor(runner))

    // Assert
    expect(group).toEqual({ name: "Encumbrance", size: -2, type: "penalty" })
  })
})

describe("DicePoolSelectors.selectArmorGroup", () => {
  it("returns the best equipped armor's rating", () => {
    // Arrange
    const [armor] = createItem<ArmorData>({
      name: "Armor Jacket",
      itemType: ItemType.armor,
      equipped: true,
      ballistic: 8,
      impact: 6,
    })
    const runner = runnerDataFactory({ items: createItemMap([armor]) })

    // Act
    const group = DicePoolSelectors.selectArmorGroup(stateFor(runner), { armorRating: ArmorRatingType.impact })

    // Assert
    expect(group).toEqual({ name: `Armor (${ArmorRatingType.impact})`, size: 6 })
  })
})

describe("DicePoolSelectors.selectActiveSkillPool", () => {
  it("assembles skill, linked Attribute, Specialization, and Wound groups", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.agility] = 4
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3, specialization: "Revolvers" }]
      s.damage.physical = 3
    } })

    // Act
    const pool = DicePoolSelectors.selectActiveSkillPool(
      stateFor(runner),
      { skill: SkillKey.pistols, specialization: "Revolvers" },
    )

    // Assert
    expect(pool).toEqual({
      id: `skill.active.${SkillKey.pistols}.Revolvers`,
      name: `${SkillKey.pistols} (Revolvers)`,
      groups: [
        { name: SkillKey.pistols, size: 3, type: "skill" },
        { name: "AGI", size: 4, type: "attribute" },
        { name: "Revolvers", size: 2 },
        { name: "Wound", size: -1, type: "penalty" },
      ],
      size: 8,
    })
  })

  it("rolls attrOverride instead of the linked Attribute", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.strength] = 5
    } })

    // Act
    const pool = DicePoolSelectors.selectActiveSkillPool(
      stateFor(runner),
      { skill: SkillKey.pistols, attrOverride: AttributeKey.strength },
    )

    // Assert
    expect(pool.groups).toContainEqual({ name: "STR", size: 5, type: "attribute" })
  })
})

describe("DicePoolSelectors.selectKnowledgeSkillPool", () => {
  it("assembles rating, Logic, and Specialization groups", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.logic] = 3
    } })

    // Act
    const pool = DicePoolSelectors.selectKnowledgeSkillPool(
      stateFor(runner),
      { knowledge: "Gangs", rating: 2, specialization: "Seattle" },
    )

    // Assert
    expect(pool).toEqual({
      id: "skill.knowledge.Gangs.Seattle",
      name: "Gangs (Seattle)",
      groups: [
        { name: "Gangs", size: 2 },
        { name: "LOG", size: 3, type: "attribute" },
        { name: "Seattle", size: 2 },
        null,
      ],
      size: 7,
    })
  })
})

describe("DicePoolSelectors.selectLanguageSkillPool", () => {
  it("rolls no rating dice for a native Language", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.intuition] = 4
    } })

    // Act
    const pool = DicePoolSelectors.selectLanguageSkillPool(
      stateFor(runner),
      { language: "English", isNative: true, rating: 6 },
    )

    // Assert
    expect(pool.groups).toEqual([
      { name: "English", size: 0 },
      { name: "INT", size: 4, type: "attribute" },
      null,
      null,
    ])
    expect(pool.size).toBe(4)
  })
})
