import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { selectAwakening } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import type { RunnerState } from "#/lib/stores/runner/runnerState.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

export function selectActiveSkills(state: RunnerData): ActiveSkillData[] {
  return state.skills.activeSkills
}

export function selectSkillGroups(state: RunnerData): SkillGroupData[] {
  return state.skills.skillGroups
}

export function selectKnowledgeSkills(state: RunnerData): KnowledgeSkillData[] {
  return state.skills.knowledgeSkills
}

export function selectLanguageSkills(state: RunnerData): LanguageSkillData[] {
  return state.skills.languageSkills
}

export function selectSkillValue(skillName: SkillKey) {
  return (state: RunnerData): number => {
    const skillInfo = skillList[skillName]
    const skillRating = state.skills.activeSkills.find((s) => s.name === skillName)?.rating ?? 0
    const groupRating = state.skills.skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
    return Math.max(skillRating, groupRating, 0)
  }
}

export function selectSkillSpecialization(skillName: SkillKey) {
  return (state: RunnerData): string | undefined => {
    return state.skills.activeSkills.find((s) => s.name === skillName)?.specialization
  }
}

export const selectAllowedActiveSkills: (state: RunnerData) => Partial<Record<SkillKey, SkillInfo>> = createSelector([
  selectAwakening,
], (awakeningType) => {
  const skillEntries = Object.entries(skillList)
    .filter(([_, info]) => {
      if (!info.awakening) return true
      return info.awakening.includes(awakeningType)
    })

  return Object.fromEntries(skillEntries)
})

const legacy = {
  selectActiveSkills,
  selectSkillGroups,
  selectKnowledgeSkills,
  selectLanguageSkills,
  selectSkillValue,
  selectSkillSpecialization,
  selectAllowedActiveSkills,
}

/** Standardized, namespaced selectors for the Skills domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace SkillsSelectors {
  export const selectActiveSkills: Selector<RunnerState, ActiveSkillData[]> = (state) =>
    legacy.selectActiveSkills(state.runner)
  export const selectSkillGroups: Selector<RunnerState, SkillGroupData[]> = (state) =>
    legacy.selectSkillGroups(state.runner)
  export const selectKnowledgeSkills: Selector<RunnerState, KnowledgeSkillData[]> = (state) =>
    legacy.selectKnowledgeSkills(state.runner)
  export const selectLanguageSkills: Selector<RunnerState, LanguageSkillData[]> = (state) =>
    legacy.selectLanguageSkills(state.runner)
  export const selectAllowedActive: Selector<RunnerState, Partial<Record<SkillKey, SkillInfo>>> = (state) =>
    legacy.selectAllowedActiveSkills(state.runner)

  export const selectValue: Selector<RunnerState, number, { skillName: SkillKey }> = createSelector(
    [
      (state: RunnerState) => state.runner,
      (_state: RunnerState, options: { skillName: SkillKey }) => options.skillName,
    ],
    (runner, skillName) => legacy.selectSkillValue(skillName)(runner),
  )

  export const selectSpecialization: Selector<RunnerState, string | undefined, { skillName: SkillKey }> =
    createSelector(
      [
        (state: RunnerState) => state.runner,
        (_state: RunnerState, options: { skillName: SkillKey }) => options.skillName,
      ],
      (runner, skillName) => legacy.selectSkillSpecialization(skillName)(runner),
    )
}
