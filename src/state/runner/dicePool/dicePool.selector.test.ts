import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { DicePoolSelectors } from "./dicePool.selector.ts"

/** `DicePoolSelectors`' `TState` — `{ runner, entity, items }` — is exactly what
 *  `useRunnerSelector` assembles from a `RunnerData` alone; tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("DicePoolSelectors.selectStandardTest", () => {
  it("assembles the Attribute, then the skill's groups", () => {
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
      { attr: AttributeKey.agility, skill: SkillKey.pistols, specialization: "Semi-Automatics" },
    )

    // Assert
    expect(pool).toEqual({
      id: `standardTest.${AttributeKey.agility}.${SkillKey.pistols}`,
      name: `AGI + ${SkillKey.pistols}`,
      groups: [
        { name: "AGI", size: 4, type: "attribute" },
        { name: SkillKey.pistols, size: 3, type: "skill" },
        { name: "Semi-Automatics", size: 2, type: "bonus" },
      ],
      size: 9,
    })
  })
})

describe("DicePoolSelectors.selectActiveSkill", () => {
  it("assembles the skill, its linked Attribute, and the Wound Modifier", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.agility] = 4
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3, specialization: "Revolvers" }]
      s.damage.physical = 3
    } })

    // Act
    const pool = DicePoolSelectors.selectActiveSkill(
      stateFor(runner),
      { skill: SkillKey.pistols, specialization: "Revolvers" },
    )

    // Assert
    expect(pool).toEqual({
      id: `skill.active.${SkillKey.pistols}.Revolvers`,
      name: `${SkillKey.pistols} (Revolvers)`,
      groups: [
        { name: SkillKey.pistols, size: 3, type: "skill" },
        { name: "Revolvers", size: 2, type: "bonus" },
        { name: "AGI", size: 4, type: "attribute" },
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
    const pool = DicePoolSelectors.selectActiveSkill(
      stateFor(runner),
      { skill: SkillKey.pistols, attrOverride: AttributeKey.strength },
    )

    // Assert
    expect(pool.groups).toContainEqual({ name: "STR", size: 5, type: "attribute" })
  })
})

describe("DicePoolSelectors.selectKnowledgeSkill", () => {
  it("assembles the skill and Logic", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.logic] = 3
    } })

    // Act
    const pool = DicePoolSelectors.selectKnowledgeSkill(
      stateFor(runner),
      { knowledge: "Gangs", rating: 2, specialization: "Seattle" },
    )

    // Assert
    expect(pool).toEqual({
      id: "skill.knowledge.Gangs.Seattle",
      name: "Gangs (Seattle)",
      groups: [
        { name: "Gangs", size: 2, type: "skill" },
        { name: "Seattle", size: 2, type: "bonus" },
        { name: "LOG", size: 3, type: "attribute" },
      ],
      size: 7,
    })
  })
})

describe("DicePoolSelectors.selectLanguageSkill", () => {
  it("assembles the skill and Intuition", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.intuition] = 4
    } })

    // Act
    const pool = DicePoolSelectors.selectLanguageSkill(
      stateFor(runner),
      { language: "English", isNative: false, rating: 3, lingo: "Cityspeak" },
    )

    // Assert
    expect(pool.groups).toEqual([
      { name: "English", size: 3, type: "skill" },
      { name: "Cityspeak", size: 2, type: "bonus" },
      { name: "INT", size: 4, type: "attribute" },
    ])
  })
})
