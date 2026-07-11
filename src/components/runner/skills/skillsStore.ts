import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
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
    setState: (skillName: SkillKey, updater: (prev?: ActiveSkillData) => ActiveSkillData) => {
      this.set((prev) => {
        const idx = prev.activeSkills.findIndex((s) => s.name === skillName)
        const existing = idx >= 0 ? prev.activeSkills[idx] : undefined
        const next = updater(existing)
        if (idx === -1) return { ...prev, activeSkills: [...prev.activeSkills, next] }
        const copy = prev.activeSkills.slice()
        copy[idx] = next
        return { ...prev, activeSkills: copy }
      })
    },

    remove: (skillName: SkillKey) => {
      this.set((prev) => ({ ...prev, activeSkills: prev.activeSkills.filter((s) => s.name !== skillName) }))
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
    setState: (groupName: SkillGroupKey, updater: (prev?: SkillGroupData) => SkillGroupData) => {
      this.set((prev) => {
        const idx = prev.skillGroups.findIndex((g) => g.name === groupName)
        const existing = idx >= 0 ? prev.skillGroups[idx] : undefined
        const next = updater(existing)
        if (idx === -1) return { ...prev, skillGroups: [...prev.skillGroups, next] }
        const copy = prev.skillGroups.slice()
        copy[idx] = next
        return { ...prev, skillGroups: copy }
      })
    },
    remove: (groupName: SkillGroupKey) => {
      this.set((prev) => ({ ...prev, skillGroups: prev.skillGroups.filter((g) => g.name !== groupName) }))
    },
  }

  knowledgeSkills = {
    setState: (skillName: string, updater: (prev?: KnowledgeSkillData) => KnowledgeSkillData) => {
      this.set((prev) => {
        const idx = prev.knowledgeSkills.findIndex((s) => s.name === skillName)
        const existing = idx >= 0 ? prev.knowledgeSkills[idx] : undefined
        const next = updater(existing)
        if (idx === -1) return { ...prev, knowledgeSkills: [...prev.knowledgeSkills, next] }
        const copy = prev.knowledgeSkills.slice()
        copy[idx] = next
        return { ...prev, knowledgeSkills: copy }
      })
    },
    remove: (skillName: string) => {
      this.set((prev) => ({ ...prev, knowledgeSkills: prev.knowledgeSkills.filter((s) => s.name !== skillName) }))
    },
  }

  languageSkills = {
    setState: (skillName: string, updater: (prev?: LanguageSkillData) => LanguageSkillData) => {
      this.set((prev) => {
        const idx = prev.languageSkills.findIndex((s) => s.name === skillName)
        const existing = idx >= 0 ? prev.languageSkills[idx] : undefined
        const next = updater(existing)
        if (idx === -1) return { ...prev, languageSkills: [...prev.languageSkills, next] }
        const copy = prev.languageSkills.slice()
        copy[idx] = next
        return { ...prev, languageSkills: copy }
      })
    },
    remove: (skillName: string) => {
      this.set((prev) => ({ ...prev, languageSkills: prev.languageSkills.filter((s) => s.name !== skillName) }))
    },
  }

  setState(stateOrUpdater: SkillsStoreState | ((prev: SkillsStoreState) => SkillsStoreState)) {
    this.set(stateOrUpdater)
  }
}
