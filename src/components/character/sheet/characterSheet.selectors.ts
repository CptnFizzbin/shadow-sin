import { useSelector } from "@tanstack/react-store"
import { createSelector } from "reselect"

import type { AwakeningData, AwakeningType } from "#/system/awakeningType.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { MetatypeData, MetatypeType } from "#/system/metatypeData.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { PowerData } from "#/system/powers/powerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { useCharacterSheetContext } from "./characterSheetContext.ts"

export type CharacterDataSelector<TData> = (state: CharacterSheet) => TData

export function useCharacterSheetSelector<T>(
  selector: CharacterDataSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useCharacterSheetContext()
  return useSelector(store, selector, { compare })
}

export const selectAwakeningType: CharacterDataSelector<AwakeningType> = (state) => {
  return state.biology.awakening
}

export const selectAwakening: CharacterDataSelector<AwakeningData> = createSelector(
  selectAwakeningType,
  (awakening) => awakenings[awakening],
)

const selectMetatypeKey: CharacterDataSelector<MetatypeType> = (state) => {
  return state.biology.metatype
}

export const selectMetatype: CharacterDataSelector<MetatypeData> = createSelector(
  selectMetatypeKey,
  (awakening) => metatypes[awakening],
)

export const selectActiveSkills: CharacterDataSelector<ActiveSkillData[]> = (state) => {
  return state.skills.activeSkills
}

export const selectSkillGroups: CharacterDataSelector<SkillGroupData[]> = (state) => {
  return state.skills.skillGroups
}

export const selectKnowledgeSkills: CharacterDataSelector<KnowledgeSkillData[]> = (state) => {
  return state.skills.knowledgeSkills
}

export const selectLanguageSkills: CharacterDataSelector<LanguageSkillData[]> = (state) => {
  return state.skills.languageSkills
}

export const selectCharacterPowers: CharacterDataSelector<PowerData[]> = (state) => {
  return state.powers
}

export const selectAllowedActiveSkills: CharacterDataSelector<Partial<Record<SkillKey, SkillInfo>>> = createSelector([
  selectAwakeningType,
], (awakeningType) => {
  const skillEntries = Object.entries(skillList)
    .filter(([_, info]) => {
      if (!info.awakening) return true
      return info.awakening.includes(awakeningType)
    })

  return Object.fromEntries(skillEntries)
})
