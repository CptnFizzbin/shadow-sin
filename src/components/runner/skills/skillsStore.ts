import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import {
  removeActiveSkill,
  removeKnowledgeSkill,
  removeLanguageSkill,
  removeSkillGroup,
  setActiveSkill,
  setKnowledgeSkill,
  setLanguageSkill,
  setSkillGroup,
  skillsSlice,
} from "#/stores/runner/skills/skillsSlice.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

export type SkillsStoreState = RunnerData["skills"]

export class SkillsStore extends StoreSlice<SkillsStoreState> {
  activeSkills = {
    /** @deprecated Dispatch `setActiveSkill` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    setState: (skillName: SkillKey, updater: (prev?: ActiveSkillData) => ActiveSkillData) => {
      this.set((prev) => {
        const existing = prev.activeSkills.find((s) => s.name === skillName)
        return skillsSlice.reducer(prev, setActiveSkill(updater(existing)))
      })
    },

    /** @deprecated Dispatch `removeActiveSkill` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    remove: (skillName: SkillKey) => {
      this.set((prev) => skillsSlice.reducer(prev, removeActiveSkill(skillName)))
    },

    getSkillValue: (skillName: SkillKey) => {
      const skillInfo = skillList[skillName]

      const skillRating = this.get().activeSkills.find((s) => s.name === skillName)?.rating ?? 0
      const groupRating = this.get().skillGroups.find((s) => s.name === skillInfo.group)?.rating ?? 0

      return Math.max(skillRating, groupRating, 0)
    },
    getSpecialization: (skillKey: string) => {
      return this.get().activeSkills.find((s) => s.name === skillKey)?.specialization
    },
  }

  skillGroups = {
    /** @deprecated Dispatch `setSkillGroup` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    setState: (groupName: SkillGroupKey, updater: (prev?: SkillGroupData) => SkillGroupData) => {
      this.set((prev) => {
        const existing = prev.skillGroups.find((g) => g.name === groupName)
        return skillsSlice.reducer(prev, setSkillGroup(updater(existing)))
      })
    },
    /** @deprecated Dispatch `removeSkillGroup` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    remove: (groupName: SkillGroupKey) => {
      this.set((prev) => skillsSlice.reducer(prev, removeSkillGroup(groupName)))
    },
  }

  knowledgeSkills = {
    /** @deprecated Dispatch `setKnowledgeSkill` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    setState: (skillName: string, updater: (prev?: KnowledgeSkillData) => KnowledgeSkillData) => {
      this.set((prev) => {
        const existing = prev.knowledgeSkills.find((s) => s.name === skillName)
        return skillsSlice.reducer(prev, setKnowledgeSkill(updater(existing)))
      })
    },
    /** @deprecated Dispatch `removeKnowledgeSkill` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    remove: (skillName: string) => {
      this.set((prev) => skillsSlice.reducer(prev, removeKnowledgeSkill(skillName)))
    },
  }

  languageSkills = {
    /** @deprecated Dispatch `setLanguageSkill` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    setState: (skillName: string, updater: (prev?: LanguageSkillData) => LanguageSkillData) => {
      this.set((prev) => {
        const existing = prev.languageSkills.find((s) => s.name === skillName)
        return skillsSlice.reducer(prev, setLanguageSkill(updater(existing)))
      })
    },
    /** @deprecated Dispatch `removeLanguageSkill` from `#/stores/runner/skills/skillsSlice.ts` via `useRunnerStoreDispatch()` instead. */
    remove: (skillName: string) => {
      this.set((prev) => skillsSlice.reducer(prev, removeLanguageSkill(skillName)))
    },
  }

  setState(stateOrUpdater: SkillsStoreState | ((prev: SkillsStoreState) => SkillsStoreState)) {
    this.set(stateOrUpdater)
  }
}
