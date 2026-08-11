import type { Selector } from "reselect"

import { AttributeKey } from "#/system/attributeKey.ts"
import { getActiveSkillCap, getAttributeCap, hasAptitudeFor } from "#/system/karma/improvements/improvementCaps.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

interface ActiveSkillCapFacets {
  cap: number
  hasAptitude: boolean
}

const selectAllActiveSkillCaps: Selector<RunnerData, Record<SkillKey, ActiveSkillCapFacets>> = (state) =>
  Object.fromEntries(Object.values(SkillKey).map((skill) => [
    skill,
    { cap: getActiveSkillCap(state, skill), hasAptitude: hasAptitudeFor(state, skill) },
  ])) as Record<SkillKey, ActiveSkillCapFacets>

const selectAllAttributeCaps: Selector<RunnerData, Record<AttributeKey, number>> = (state) =>
  Object.fromEntries(
    Object.values(AttributeKey).map((attr) => [attr, getAttributeCap(state, attr)]),
  ) as Record<AttributeKey, number>

export const karmaCapsCatalog = {
  activeSkill: {
    all: selectAllActiveSkillCaps,
    forSkill: (skill: SkillKey) => ({
      cap: (state: RunnerData): number => getActiveSkillCap(state, skill),
      hasAptitude: (state: RunnerData): boolean => hasAptitudeFor(state, skill),
    }),
  },
  attribute: {
    all: selectAllAttributeCaps,
    forAttr: (attr: AttributeKey): Selector<RunnerData, number> => (state) => getAttributeCap(state, attr),
  },
}
