import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import {
  selectActiveSkills,
  selectAllowedActiveSkills,
  selectKnowledgeSkills,
  selectLanguageSkills,
  selectSkillGroups,
  selectSkillSpecialization,
  selectSkillValue,
  SkillsSelectors,
} from "./skillsSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectActiveSkills", () => {
  it("returns the runner's active skills", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      return s
    })

    // Act / Assert
    expect(selectActiveSkills(runner)).toBe(runner.skills.activeSkills)
  })
})

describe("selectSkillGroups", () => {
  it("returns the runner's skill groups", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 2 }]
      return s
    })

    // Act / Assert
    expect(selectSkillGroups(runner)).toBe(runner.skills.skillGroups)
  })
})

describe("selectKnowledgeSkills", () => {
  it("returns the runner's knowledge skills", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectKnowledgeSkills(runner)).toBe(runner.skills.knowledgeSkills)
  })
})

describe("selectLanguageSkills", () => {
  it("returns the runner's language skills", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectLanguageSkills(runner)).toBe(runner.skills.languageSkills)
  })
})

describe("selectSkillValue", () => {
  it("returns the max of the skill's own rating and its group's rating", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2 }]
      s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 4 }]
      return s
    })

    // Act / Assert
    expect(selectSkillValue(SkillKey.pistols)(runner)).toBe(4)
  })

  it("returns 0 when neither the skill nor its group is trained", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectSkillValue(SkillKey.pistols)(runner)).toBe(0)
  })
})

describe("selectSkillSpecialization", () => {
  it("returns the runner's specialization for the skill", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2, specialization: "Semi-Automatics" }]
      return s
    })

    // Act / Assert
    expect(selectSkillSpecialization(SkillKey.pistols)(runner)).toBe("Semi-Automatics")
  })
})

describe("selectAllowedActiveSkills", () => {
  it("excludes skills requiring an awakening the runner doesn't have", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const allowed = selectAllowedActiveSkills(runner)

    // Assert
    expect(allowed[SkillKey.pistols]).toBeDefined()
    expect(Object.values(allowed).every((info) => !info.awakening)).toBe(true)
  })
})

describe("SkillsSelectors.selectActiveSkills", () => {
  it("returns the runner's active skills", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      return s
    })

    // Act / Assert
    expect(SkillsSelectors.selectActiveSkills(stateFor(runner))).toBe(runner.skills.activeSkills)
  })
})

describe("SkillsSelectors.selectValue", () => {
  it("returns the max of the skill's own rating and its group's rating", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2 }]
      s.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 4 }]
      return s
    })

    // Act / Assert
    expect(SkillsSelectors.selectValue(stateFor(runner), { skillName: SkillKey.pistols })).toBe(4)
  })
})

describe("SkillsSelectors.selectSpecialization", () => {
  it("returns the runner's specialization for the skill", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2, specialization: "Semi-Automatics" }]
      return s
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
