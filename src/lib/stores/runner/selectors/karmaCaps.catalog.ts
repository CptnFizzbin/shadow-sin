import type { AttributeKey } from "#/system/attributeKey.ts"
import { getActiveSkillCap, getAttributeCap, hasAptitudeFor } from "#/system/karma/improvements/improvementCaps.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

interface ActiveSkillCapFacets {
  cap: number
  hasAptitude: boolean
}

/**
 * Each entry here is `Selector<RunnerData, (arg) => T>` rather than `(arg) => Selector<RunnerData, T>` —
 * deliberately curried state-first. A `useRunnerSelector` picker returning `karmaCaps.activeSkill`
 * gets `RunnerData` applied once by the hook and gets back a plain `(skill) => Facets` lookup, reusable
 * for every row in a list without a `useRunnerSelector` call per row.
 */
export const karmaCapsCatalog = {
  activeSkill: (state: RunnerData) => (skill: SkillKey): ActiveSkillCapFacets => ({
    cap: getActiveSkillCap(state, skill),
    hasAptitude: hasAptitudeFor(state, skill),
  }),
  attribute: (state: RunnerData) => (attr: AttributeKey): number => getAttributeCap(state, attr),
}
