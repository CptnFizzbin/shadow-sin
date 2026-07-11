import { useSelector } from "@tanstack/react-store"
import { createSelector } from "reselect"

import type { AwakeningData, AwakeningType } from "#/system/awakeningType.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { MetatypeData, MetatypeType } from "#/system/metatypeData.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { PowerData } from "#/system/powers/powerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { useRunnerDataContext } from "./runnerStore.context.ts"

export type RunnerDataSelector<TData> = (state: RunnerData) => TData

export function useRunnerStoreSelector<T>(
  selector: RunnerDataSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useRunnerDataContext()
  return useSelector(store, selector, { compare })
}

export const selectAwakeningType: RunnerDataSelector<AwakeningType> = (state) => {
  return state.biology.awakening
}

export const selectAwakening: RunnerDataSelector<AwakeningData> = createSelector(
  selectAwakeningType,
  (awakening) => awakenings[awakening],
)

const selectMetatypeKey: RunnerDataSelector<MetatypeType> = (state) => {
  return state.biology.metatype
}

export const selectMetatype: RunnerDataSelector<MetatypeData> = createSelector(
  selectMetatypeKey,
  (awakening) => metatypes[awakening],
)

export const selectActiveSkills: RunnerDataSelector<ActiveSkillData[]> = (state) => {
  return state.skills.activeSkills
}

export const selectSkillGroups: RunnerDataSelector<SkillGroupData[]> = (state) => {
  return state.skills.skillGroups
}

export const selectKnowledgeSkills: RunnerDataSelector<KnowledgeSkillData[]> = (state) => {
  return state.skills.knowledgeSkills
}

export const selectLanguageSkills: RunnerDataSelector<LanguageSkillData[]> = (state) => {
  return state.skills.languageSkills
}

export const selectAllowedActiveSkills: RunnerDataSelector<Partial<Record<SkillKey, SkillInfo>>> = createSelector([
  selectAwakeningType,
], (awakeningType) => {
  const skillEntries = Object.entries(skillList)
    .filter(([_, info]) => {
      if (!info.awakening) return true
      return info.awakening.includes(awakeningType)
    })

  return Object.fromEntries(skillEntries)
})

export const selectRunnerPowers: RunnerDataSelector<PowerData[]> = (state) => {
  return state.powers
}
