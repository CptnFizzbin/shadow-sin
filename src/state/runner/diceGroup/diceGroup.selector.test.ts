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

import { DiceGroupSelectors } from "./diceGroup.selector.ts"

/** `DiceGroupSelectors`' `TState` — `{ runner, entity, items }` — is exactly what
 *  `useRunnerSelector` assembles from a `RunnerData` alone; tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("DiceGroupSelectors.selectAttr", () => {
  it("returns just the base Attribute rating", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.agility] = 4
    } })

    // Act
    const groups = DiceGroupSelectors.selectAttr(stateFor(runner), { attr: AttributeKey.agility })

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
    const groups = DiceGroupSelectors.selectAttr(stateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
  })

  it("returns the same reference for equal options passed as a new object", () => {
    // Arrange
    const state = stateFor(runnerDataFactory())

    // Act
    const first = DiceGroupSelectors.selectAttr(state, { attr: AttributeKey.charisma })
    const second = DiceGroupSelectors.selectAttr(state, { attr: AttributeKey.charisma })

    // Assert
    expect(second).toBe(first)
  })
})

describe("DiceGroupSelectors.selectSkill", () => {
  it("returns the base Skill rating when trained", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
    } })

    // Act
    const groups = DiceGroupSelectors.selectSkill(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{ name: SkillKey.pistols, size: 3, type: "skill" }])
  })

  it("defaults to a -1 Defaulting penalty when untrained and defaultable", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectSkill(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{ name: `${SkillKey.pistols} - Defaulting`, size: -1, type: "defaulting" }])
  })

  it("rolls a flat 0 instead of Defaulting when untrained and not defaultable", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectSkill(stateFor(runner), { skill: SkillKey.arcana })

    // Assert
    expect(groups).toEqual([{ name: SkillKey.arcana, size: 0, type: "skill" }])
  })

  it("rolls a flat 0 instead of Defaulting when untrained and excludeDefaulting is set", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectSkill(
      stateFor(runner),
      { skill: SkillKey.pistols, excludeDefaulting: true },
    )

    // Assert
    expect(groups).toEqual([{ name: SkillKey.pistols, size: 0, type: "skill" }])
  })

  it("adds a combined mod entry from active skillMod GameEffects targeting the skill", () => {
    // Arrange
    const [implant] = createItem({
      name: "Reflex Recorder",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.skillMod, target: SkillKey.pistols, value: 2 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      },
    })

    // Act
    const groups = DiceGroupSelectors.selectSkill(stateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: `${SkillKey.pistols} Mod`, size: 2, type: "bonus" },
    ])
  })

  it("adds the Specialization bonus, including matching skillSpecializationMod GameEffects", () => {
    // Arrange
    const [implant] = createItem({
      name: "Revolver Focus",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{
        type: GameEffectType.skillSpecializationMod,
        target: SkillKey.pistols,
        subTarget: "Revolvers",
        value: 1,
      }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3, specialization: "Revolvers" }]
      },
    })

    // Act
    const groups = DiceGroupSelectors.selectSkill(
      stateFor(runner),
      { skill: SkillKey.pistols, specialization: "Revolvers" },
    )

    // Assert
    expect(groups).toEqual([
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: "Revolvers", size: 3, type: "bonus" },
    ])
  })
})

describe("DiceGroupSelectors.selectKnowledgeSkill", () => {
  it("returns the given rating plus the Specialization bonus", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectKnowledgeSkill(
      stateFor(runner),
      { knowledge: "Gangs", rating: 2, specialization: "Seattle" },
    )

    // Assert
    expect(groups).toEqual([
      { name: "Gangs", size: 2, type: "skill" },
      { name: "Seattle", size: 2, type: "bonus" },
    ])
  })
})

describe("DiceGroupSelectors.selectLanguageSkill", () => {
  it("contributes no rating dice for a native Language", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectLanguageSkill(
      stateFor(runner),
      { language: "English", isNative: true, rating: 6 },
    )

    // Assert
    expect(groups).toEqual([{ name: "English", size: 0, type: "skill" }])
  })
})

describe("DiceGroupSelectors.selectWound", () => {
  it("returns nothing when uninjured", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectWound(stateFor(runner))

    // Assert
    expect(groups).toEqual([])
  })

  it("returns the Wound Modifier as a penalty", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const groups = DiceGroupSelectors.selectWound(stateFor(runner))

    // Assert
    expect(groups).toEqual([{ name: "Wound", size: -1, type: "penalty" }])
  })
})

describe("DiceGroupSelectors.selectEncumbrance", () => {
  it("returns nothing when unencumbered", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = DiceGroupSelectors.selectEncumbrance(stateFor(runner))

    // Assert
    expect(groups).toEqual([])
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
    const groups = DiceGroupSelectors.selectEncumbrance(stateFor(runner))

    // Assert
    expect(groups).toEqual([{ name: "Encumbrance", size: -2, type: "penalty" }])
  })
})

describe("DiceGroupSelectors.selectArmor", () => {
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
    const groups = DiceGroupSelectors.selectArmor(stateFor(runner), { armorRating: ArmorRatingType.impact })

    // Assert
    expect(groups).toEqual([{ name: `Armor (${ArmorRatingType.impact})`, size: 6 }])
  })
})
