import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { SkillsSelectors } from "./skillsSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("SkillsSelectors.selectActiveSkills", () => {
  it("returns the runner's active skills", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
    } })

    // Act / Assert
    expect(SkillsSelectors.selectActiveSkills(stateFor(runner))).toBe(runner.skills.activeSkills)
  })
})

describe("SkillsSelectors.selectSkillGroups", () => {
  it("returns the runner's skill groups", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 2 }]
    } })

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
  it("returns the max of the skill's own rating and its group's rating", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2 }]
      s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 4 }]
    } })

    // Act / Assert
    expect(SkillsSelectors.selectValue(stateFor(runner), { skillName: SkillKey.pistols })).toBe(4)
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
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2, specialization: "Semi-Automatics" }]
    } })

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
