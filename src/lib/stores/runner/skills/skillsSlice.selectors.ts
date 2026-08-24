import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { SelectorOptions } from "#/lib/stores/runner/selectorOptions.ts"
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
export function selectActiveSkills(runner: RunnerData): ActiveSkillData[] {
  return mapToLegacySelector(runner, SkillsSelectors.selectActiveSkills)
}

/** @deprecated Use `SkillsSelectors.selectSkillGroups` via `useRunnerSelector` instead. */
export function selectSkillGroups(runner: RunnerData): SkillGroupData[] {
  return mapToLegacySelector(runner, SkillsSelectors.selectSkillGroups)
}

/** @deprecated Use `SkillsSelectors.selectKnowledgeSkills` via `useRunnerSelector` instead. */
export function selectKnowledgeSkills(runner: RunnerData): KnowledgeSkillData[] {
  return mapToLegacySelector(runner, SkillsSelectors.selectKnowledgeSkills)
}

/** @deprecated Use `SkillsSelectors.selectLanguageSkills` via `useRunnerSelector` instead. */
export function selectLanguageSkills(runner: RunnerData): LanguageSkillData[] {
  return mapToLegacySelector(runner, SkillsSelectors.selectLanguageSkills)
}

/** @deprecated Use `SkillsSelectors.selectValue` via `useRunnerSelector` instead. */
export function selectSkillValue(skillName: SkillKey) {
  return (runner: RunnerData): number => {
    return mapToLegacySelector(runner, SkillsSelectors.selectValue, { skillName })
  }
}

/** @deprecated Use `SkillsSelectors.selectSpecialization` via `useRunnerSelector` instead. */
export function selectSkillSpecialization(skillName: SkillKey) {
  return (runner: RunnerData): string | undefined => {
    return mapToLegacySelector(runner, SkillsSelectors.selectSpecialization, { skillName })
  }
}

/** @deprecated Use `SkillsSelectors.selectAllowedActive` via `useRunnerSelector` instead. */
export function selectAllowedActiveSkills(runner: RunnerData): Partial<Record<SkillKey, SkillInfo>> {
  return mapToLegacySelector(runner, SkillsSelectors.selectAllowedActive)
}

export namespace SkillsSelectors {
  export const Options = {
    skillName: SelectorOptions.skillName,
  }

  export const selectActiveSkills = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.skills.activeSkills,
  )

  export const selectSkillGroups = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.skills.skillGroups,
  )

  export const selectKnowledgeSkills = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.skills.knowledgeSkills,
  )

  export const selectLanguageSkills = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.skills.languageSkills,
  )

  export const selectAllowedActive = createMemoizedSelector(
    BiologySelectors.selectAwakening,
    (awakeningType) => {
      const skillEntries = Object.entries(skillList)
        .filter(([_, info]) => {
          if (!info.awakening) return true
          return info.awakening.includes(awakeningType)
        })

      return Object.fromEntries(skillEntries) as Partial<Record<SkillKey, SkillInfo>>
    },
  )

  export const selectValue = createMemoizedSelector(
    selectActiveSkills,
    selectSkillGroups,
    Options.skillName,
    (activeSkills, skillGroups, skillName) => {
      const skillInfo = skillList[skillName]
      const skillRating = activeSkills.find((s) => s.name === skillName)?.rating ?? 0
      const groupRating = skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
      return Math.max(skillRating, groupRating, 0)
    },
  )

  export const selectSpecialization = createMemoizedSelector(
    selectActiveSkills,
    Options.skillName,
    (activeSkills, skillName) => activeSkills.find((s) => s.name === skillName)?.specialization,
  )
}
