import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { DicePoolSelectors } from "./dicePoolSlice.selectors.ts"

/** `DicePoolSelectors`' `TState` — `{ runner, entity, items }` — is exactly what
 *  `useRunnerSelector` assembles from a `RunnerData` alone; tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("DicePoolSelectors.selectAttrTest", () => {
  it("returns just the base Attribute rating when no attrMod GameEffects apply", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.agility] = 4
    } })

    // Act
    const groups = DicePoolSelectors.selectAttrTest(stateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
  })

  it("adds a combined mod entry from active attrMod GameEffects targeting the attribute", () => {
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
    expect(groups).toEqual([
      { name: "AGI", size: 4, type: "attribute" },
      { name: "AGI Mod", size: 2, type: "bonus" },
    ])
  })

  it("ignores attrMod GameEffects targeting a different attribute", () => {
    // Arrange
    const [implant] = createItem({
      name: "Cerebral Booster",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
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
  it("assembles Base Attribute, Attribute mod(s), Base Skill, and Skill mod(s) in order", () => {
    // Arrange
    const [implant] = createItem({
      name: "Muscle Augmentation",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 1 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
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
      { name: "AGI Mod", size: 1, type: "bonus" },
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: `${SkillKey.pistols} Mod`, size: 2, type: "bonus" },
    ])
    expect(pool.size).toBe(4 + 1 + 3 + 2)
  })
})
