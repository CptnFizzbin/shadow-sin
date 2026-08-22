import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import { selectAwakening } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

/** @deprecated Use `SkillsSelectors.selectActiveSkills` via `useRunnerSelector` instead. */
export function selectActiveSkills(state: RunnerData): ActiveSkillData[] {
  return state.skills.activeSkills
}

/** @deprecated Use `SkillsSelectors.selectSkillGroups` via `useRunnerSelector` instead. */
export function selectSkillGroups(state: RunnerData): SkillGroupData[] {
  return state.skills.skillGroups
}

/** @deprecated Use `SkillsSelectors.selectKnowledgeSkills` via `useRunnerSelector` instead. */
export function selectKnowledgeSkills(state: RunnerData): KnowledgeSkillData[] {
  return state.skills.knowledgeSkills
}

/** @deprecated Use `SkillsSelectors.selectLanguageSkills` via `useRunnerSelector` instead. */
export function selectLanguageSkills(state: RunnerData): LanguageSkillData[] {
  return state.skills.languageSkills
}

/** @deprecated Use `SkillsSelectors.selectValue` via `useRunnerSelector` instead. */
export function selectSkillValue(skillName: SkillKey) {
  return (state: RunnerData): number => {
    const skillInfo = skillList[skillName]
    const skillRating = state.skills.activeSkills.find((s) => s.name === skillName)?.rating ?? 0
    const groupRating = state.skills.skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
    return Math.max(skillRating, groupRating, 0)
  }
}

/** @deprecated Use `SkillsSelectors.selectSpecialization` via `useRunnerSelector` instead. */
export function selectSkillSpecialization(skillName: SkillKey) {
  return (state: RunnerData): string | undefined => {
    return state.skills.activeSkills.find((s) => s.name === skillName)?.specialization
  }
}

/** @deprecated Use `SkillsSelectors.selectAllowedActive` via `useRunnerSelector` instead. */
export const selectAllowedActiveSkills: (state: RunnerData) => Partial<Record<SkillKey, SkillInfo>> = createMemoizedSelector([
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
  export type SkillsSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const Options = {
    skillName: selectorOption<{ skillName: SkillKey }>("skillName"),
  }

  export const selectActiveSkills = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => legacy.selectActiveSkills(runner),
  ) satisfies SkillsSelector<ActiveSkillData[]>
  export const selectSkillGroups = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => legacy.selectSkillGroups(runner),
  ) satisfies SkillsSelector<SkillGroupData[]>
  export const selectKnowledgeSkills = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => legacy.selectKnowledgeSkills(runner),
  ) satisfies SkillsSelector<KnowledgeSkillData[]>
  export const selectLanguageSkills = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => legacy.selectLanguageSkills(runner),
  ) satisfies SkillsSelector<LanguageSkillData[]>
  export const selectAllowedActive = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => legacy.selectAllowedActiveSkills(runner),
  ) satisfies SkillsSelector<Partial<Record<SkillKey, SkillInfo>>>

  export const selectValue = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    Options.skillName,
    (runner, skillName) => legacy.selectSkillValue(skillName)(runner),
  ) satisfies SkillsSelector<number, { skillName: SkillKey }>

  export const selectSpecialization = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    Options.skillName,
    (runner, skillName) => legacy.selectSkillSpecialization(skillName)(runner),
  ) satisfies SkillsSelector<string | undefined, { skillName: SkillKey }>
}
