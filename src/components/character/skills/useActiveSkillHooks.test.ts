import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SkillKey } from "#/system/skills/skillKey.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { makeCharacterSheet, makeCharacterSheetWrapper } from "#testUtils/renderUtils.tsx"

import { useActiveSkill, useActiveSkillRating } from "./useActiveSkillHooks.ts"

describe("useActiveSkillRating", () => {
  it("returns 0 when no active skill or group is set", () => {
    // Arrange
    const sheet = makeCharacterSheet()

    // Act
    const { result } = renderHook(() => useActiveSkillRating(SkillKey.blades), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(0)
  })

  it("returns the individual skill rating", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.skills.activeSkills = [{ name: SkillKey.blades, rating: 4 }]
    })

    // Act
    const { result } = renderHook(() => useActiveSkillRating(SkillKey.blades), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(4)
  })

  it("returns the group rating when it exceeds the individual rating", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.skills.activeSkills = [{ name: SkillKey.blades, rating: 2 }]
      s.skills.skillGroups = [{ name: SkillGroupKey.CloseCombat, rating: 5 }]
    })

    // Act
    const { result } = renderHook(() => useActiveSkillRating(SkillKey.blades), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(5)
  })

  it("returns the individual rating when it exceeds the group rating", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.skills.activeSkills = [{ name: SkillKey.blades, rating: 6 }]
      s.skills.skillGroups = [{ name: SkillGroupKey.CloseCombat, rating: 3 }]
    })

    // Act
    const { result } = renderHook(() => useActiveSkillRating(SkillKey.blades), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(6)
  })
})

describe("useActiveSkill", () => {
  it("returns rating + attribute when no mods are present", () => {
    // Arrange — blades uses Agility; agility defaults to 3 in the default sheet
    const sheet = makeCharacterSheet((s) => {
      s.skills.activeSkills = [{ name: SkillKey.blades, rating: 4 }]
      s.attributes.agility = 3
    })

    // Act
    const { result } = renderHook(() => useActiveSkill(SkillKey.blades), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(7)
  })

  it("returns 0 + attribute when neither skill nor group is set", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.attributes.agility = 3
    })

    // Act
    const { result } = renderHook(() => useActiveSkill(SkillKey.blades), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(3)
  })
})
