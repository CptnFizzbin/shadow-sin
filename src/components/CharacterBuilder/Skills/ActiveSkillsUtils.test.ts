import { describe, expect, it } from "vitest"

import {
  getDisabledGroups,
  getDisabledSkills,
} from "#/components/CharacterBuilder/Skills/ActiveSkillsUtils.ts"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeActiveSkill = (
  overrides: Partial<ActiveSkillFormState> & { name: string },
): ActiveSkillFormState => ({
  id: overrides.name,
  rating: 3,
  ...overrides,
})

const makeActiveSkillGroup = (
  overrides: Partial<ActiveSkillGroupFormState> & { groupName: SkillGroupKey },
): ActiveSkillGroupFormState => ({
  id: overrides.groupName,
  rating: 3,
  ...overrides,
})

// ─── getDisabledSkills ────────────────────────────────────────────────────

describe("getDisabledSkills", () => {
  it("returns an empty set when no skills or groups exist", () => {
    const result = getDisabledSkills([], [], null)
    expect(result.size).toBe(0)
  })

  it("disables skill names that are already in the list (excluding the editing skill)", () => {
    const skills = [
      makeActiveSkill({ name: "Pistols", id: "skill-1" }),
      makeActiveSkill({ name: "Stealth", id: "skill-2" }),
    ]

    // Editing skill-1; only skill-2's name should be disabled
    const result = getDisabledSkills(skills, [], "skill-1")

    expect(result.has("Stealth")).toBe(true)
    expect(result.has("Pistols")).toBe(false)
  })

  it("disables skills covered by a selected group", () => {
    // "Automatics" is in the Firearms group
    const groups = [
      makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms }),
    ]

    const result = getDisabledSkills([], groups, null)

    expect(result.has("Automatics")).toBe(true)
  })

  it("includes both existing skills and group-covered skills in the disabled set", () => {
    const skills = [makeActiveSkill({ name: "Stealth", id: "skill-s" })]
    const groups = [makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms })]

    const result = getDisabledSkills(skills, groups, null)

    expect(result.has("Stealth")).toBe(true)
    expect(result.has("Automatics")).toBe(true)
  })
})

// ─── getDisabledGroups ────────────────────────────────────────────────────

describe("getDisabledGroups", () => {
  it("returns an empty set when no groups exist", () => {
    const result = getDisabledGroups([], null)
    expect(result.size).toBe(0)
  })

  it("disables group names that are already selected (excluding the editing group)", () => {
    const groups = [
      makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms, id: "group-f" }),
      makeActiveSkillGroup({ groupName: SkillGroupKey.Athletics, id: "group-a" }),
    ]

    // Editing group-f; only Athletics should be disabled
    const result = getDisabledGroups(groups, "group-f")

    expect(result.has(SkillGroupKey.Athletics)).toBe(true)
    expect(result.has(SkillGroupKey.Firearms)).toBe(false)
  })

  it("disables all group names when editingGroupId is null", () => {
    const groups = [
      makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms }),
      makeActiveSkillGroup({ groupName: SkillGroupKey.Stealth }),
    ]

    const result = getDisabledGroups(groups, null)

    expect(result.has(SkillGroupKey.Firearms)).toBe(true)
    expect(result.has(SkillGroupKey.Stealth)).toBe(true)
  })
})
