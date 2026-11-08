import { describe, expect, it } from "vitest"

import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import { SkillGroupKey } from "#/system/model/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { SkillsSelectors } from "./skills.selector.ts"

const stateFor = (runner: RunnerData) => ({
  runner: runner,
  entity: runner,
})

describe("SkillsSelectors.selectActiveSkills", () => {
  it("returns the runner's active skills", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      },
    })

    // Act / Assert
    expect(SkillsSelectors.selectActiveSkills(stateFor(runner))).toBe(runner.skills.activeSkills)
  })
})

describe("SkillsSelectors.selectSkillGroups", () => {
  it("returns the runner's skill groups", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 2 }]
      },
    })

    // Act / Assert
    expect(SkillsSelectors.selectSkillGroups(stateFor(runner))).toBe(runner.skills.skillGroups)
  })
})

describe("SkillsSelectors.selectKnowledgeSkills", () => {
  it("returns the runner's knowledge skills", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SkillsSelectors.selectKnowledgeSkills(stateFor(runner))).toBe(runner.skills.knowledgeSkills)
  })
})

describe("SkillsSelectors.selectLanguageSkills", () => {
  it("returns the runner's language skills", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SkillsSelectors.selectLanguageSkills(stateFor(runner))).toBe(runner.skills.languageSkills)
  })
})

describe("SkillsSelectors.selectValue", () => {
  it.each([
    { skillRating: 2, groupRating: 4, expected: 4 },
    { skillRating: 5, groupRating: 2, expected: 5 },
  ])("returns the max of the skill's own rating ($skillRating) and its group's rating ($groupRating)", ({ skillRating, groupRating, expected }) => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: skillRating }]
        s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: groupRating }]
      },
    })

    // Act / Assert
    expect(SkillsSelectors.selectValue(stateFor(runner), { skillName: SkillKey.pistols })).toBe(expected)
  })

  it("returns 0 when neither the skill nor its group is trained", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SkillsSelectors.selectValue(stateFor(runner), { skillName: SkillKey.pistols })).toBe(0)
  })
})

describe("SkillsSelectors.selectSpecialization", () => {
  it("returns the runner's specialization for the skill", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2, specialization: "Semi-Automatics" }]
      },
    })

    // Act / Assert
    expect(SkillsSelectors.selectSpecialization(stateFor(runner), { skillName: SkillKey.pistols })).toBe(
      "Semi-Automatics",
    )
  })
})

describe("SkillsSelectors.selectAllowedActive", () => {
  it("excludes skills requiring an awakening the runner doesn't have", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const allowed = SkillsSelectors.selectAllowedActive(stateFor(runner))

    // Assert
    expect(allowed[SkillKey.pistols]).toBeDefined()
    expect(Object.values(allowed).every((info) => !info.awakening)).toBe(true)
  })
})

describe("SkillsSelectors.selectRatingBreakdown", () => {
  it("adds active skillMod GameEffects to the raw value, named after their source", () => {
    // Arrange
    const [implant] = createItem({
      name: "Skillwire",
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
    const breakdown = SkillsSelectors.selectRatingBreakdown(
      { runner, entity: runner, items: getItemCatalog(runner) },
      { skill: SkillKey.pistols },
    )

    // Assert
    expect(breakdown).toEqual({ rawValue: 3, modifiers: [{ name: "Skillwire", value: 1 }], rating: 4 })
  })
})

/** Dice Group selectors read `{ runner, entity, items }` — what `useRunnerSelector` assembles from a `RunnerData`. */
const diceGroupStateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("SkillsSelectors.DiceGroups.selectSkill", () => {
  it("returns the base Skill rating when trained", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
    } })

    // Act
    const groups = SkillsSelectors.DiceGroups.selectSkill(diceGroupStateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{ name: SkillKey.pistols, size: 3, type: "skill" }])
  })

  it("defaults to a -1 Defaulting penalty when untrained and defaultable", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = SkillsSelectors.DiceGroups.selectSkill(diceGroupStateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{ name: `${SkillKey.pistols} - Defaulting`, size: -1, type: "defaulting" }])
  })

  it("rolls a flat 0 instead of Defaulting when untrained and not defaultable", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = SkillsSelectors.DiceGroups.selectSkill(diceGroupStateFor(runner), { skill: SkillKey.arcana })

    // Assert
    expect(groups).toEqual([{ name: SkillKey.arcana, size: 0, type: "skill" }])
  })

  it("rolls a flat 0 instead of Defaulting when untrained and excludeDefaulting is set", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = SkillsSelectors.DiceGroups.selectSkill(
      diceGroupStateFor(runner),
      { skill: SkillKey.pistols, excludeDefaulting: true },
    )

    // Assert
    expect(groups).toEqual([{ name: SkillKey.pistols, size: 0, type: "skill" }])
  })

  it("includes active skillMod GameEffects in the size and lists them as modifiers", () => {
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
    const groups = SkillsSelectors.DiceGroups.selectSkill(diceGroupStateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([{
      name: SkillKey.pistols,
      size: 5,
      type: "skill",
      breakdown: { rawValue: 3, modifiers: [{ name: "Reflex Recorder", value: 2 }], rating: 5 },
    }])
  })
})

describe("SkillsSelectors.DiceGroups.selectSpecialization", () => {
  it("returns the Specialization bonus with matching skillSpecializationMod GameEffects as modifiers", () => {
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
    const groups = SkillsSelectors.DiceGroups.selectSpecialization(
      diceGroupStateFor(runner),
      { skill: SkillKey.pistols, specialization: "Revolvers" },
    )

    // Assert
    expect(groups).toEqual([
      {
        name: "Specialization: Revolvers",
        size: 3,
        type: "bonus",
        breakdown: { rawValue: 2, modifiers: [{ name: "Revolver Focus", value: 1 }], rating: 3 },
      },
    ])
  })

  it("returns nothing without a specialization", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = SkillsSelectors.DiceGroups.selectSpecialization(diceGroupStateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([])
  })
})

describe("SkillsSelectors.DiceGroups.selectSkill when defaulting", () => {
  it("keeps the skill group alongside Defaulting when modifiers give it dice", () => {
    // Arrange
    const [implant] = createItem({
      name: "Skillwire",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.skillMod, target: SkillKey.pistols, value: 1 }],
    })
    const runner = runnerDataFactory({ items: createItemMap([implant]) })

    // Act
    const groups = SkillsSelectors.DiceGroups.selectSkill(diceGroupStateFor(runner), { skill: SkillKey.pistols })

    // Assert
    expect(groups).toEqual([
      {
        name: SkillKey.pistols,
        size: 1,
        type: "skill",
        breakdown: { rawValue: 0, modifiers: [{ name: "Skillwire", value: 1 }], rating: 1 },
      },
      { name: `${SkillKey.pistols} - Defaulting`, size: -1, type: "defaulting" },
    ])
  })
})

describe("SkillsSelectors.DiceGroups.selectKnowledgeSkill", () => {
  it("returns the given rating plus the Specialization bonus", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = SkillsSelectors.DiceGroups.selectKnowledgeSkill(
      diceGroupStateFor(runner),
      { knowledge: "Gangs", rating: 2, specialization: "Seattle" },
    )

    // Assert
    expect(groups).toEqual([
      { name: "Gangs", size: 2, type: "skill" },
      { name: "Specialization: Seattle", size: 2, type: "bonus" },
    ])
  })
})

describe("SkillsSelectors.DiceGroups.selectLanguageSkill", () => {
  it("contributes no rating dice for a native Language", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const groups = SkillsSelectors.DiceGroups.selectLanguageSkill(
      diceGroupStateFor(runner),
      { language: "English", isNative: true, rating: 6 },
    )

    // Assert
    expect(groups).toEqual([{ name: "English", size: 0, type: "skill" }])
  })
})
