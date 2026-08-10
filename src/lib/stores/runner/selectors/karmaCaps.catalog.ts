import type { AttributeKey } from "#/system/attributeKey.ts"
import { getActiveSkillCap, getAttributeCap, hasAptitudeFor } from "#/system/karma/improvements/improvementCaps.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

interface ActiveSkillCapFacets {
  cap: number
  hasAptitude: boolean
}

export function buildKarmaCapsCatalog(state: RunnerData) {
  return {
    activeSkill: (skill: SkillKey): ActiveSkillCapFacets => ({
      cap: getActiveSkillCap(state, skill),
      hasAptitude: hasAptitudeFor(state, skill),
    }),
    attribute: (attr: AttributeKey): number => getAttributeCap(state, attr),
  }
}
