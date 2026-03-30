import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillGroupData } from "#/lib/system/skillData.ts"

export type SkillStoreState = CharacterSheet["skills"]

export interface UseSkillsStore extends BaseAtom<SkillStoreState> {
  activeSkills: {
    remove(skillName: SkillKey): void
    setState(skillName: SkillKey, updater: (prev: ActiveSkillData) => ActiveSkillData): void
  }
  skillGroups: {
    remove(groupName: SkillGroupKey): void
    setState(groupName: SkillGroupKey, updater: (prev: SkillGroupData) => SkillGroupData): void
  }
  knowledgeSkills: {
    remove(skillName: string): void
    setState(skillName: string, updater: (prev: KnowledgeSkillData) => KnowledgeSkillData): void
  }
  languageSkills: {
    remove(skillName: string): void
    setState(skillName: string, updater: (prev: LanguageSkillData) => LanguageSkillData): void
  }

  setState(updater: (prev: SkillStoreState) => SkillStoreState): void
}

export const useSkillsStore = (): UseSkillsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseSkillsStore => {
    const skillStore = createStore(() => store.state.skills)

    return {
      get: () => skillStore.get(),
      subscribe: (listener) => skillStore.subscribe(listener),

      setState: (updater) => {
        store.setState(produce((prev) => {
          prev.skills = updater(prev.skills)
        }))
      },

      activeSkills: {
        remove: (skillName) => {
          store.setState(produce((prev) => {
            prev.skills.activeSkills = prev.skills.activeSkills.filter((s) => s.name !== skillName)
          }))
        },
        setState: (skillName, updater) => {
          store.setState(produce((prev) => {
            const index = prev.skills.activeSkills.findIndex((s) => s.name === skillName)
            if (index === -1) {
              prev.skills.activeSkills.push(updater({ name: skillName, rating: 0 }))
            } else {
              prev.skills.activeSkills[index] = updater(prev.skills.activeSkills[index])
            }
          }))
        },
      },

      skillGroups: {
        remove: (groupName) => {
          store.setState(produce((prev) => {
            prev.skills.skillGroups = prev.skills.skillGroups.filter((g) => g.name !== groupName)
          }))
        },
        setState: (groupName, updater) => {
          store.setState(produce((prev) => {
            const index = prev.skills.skillGroups.findIndex((g) => g.name === groupName)
            if (index === -1) {
              prev.skills.skillGroups.push(updater({ name: groupName, rating: 0 }))
            } else {
              prev.skills.skillGroups[index] = updater(prev.skills.skillGroups[index])
            }
          }))
        },
      },

      knowledgeSkills: {
        remove: (skillName) => {
          store.setState(produce((prev) => {
            prev.skills.knowledgeSkills = prev.skills.knowledgeSkills.filter((s) => s.name !== skillName)
          }))
        },
        setState: (skillName, updater) => {
          store.setState(produce((prev) => {
            const index = prev.skills.knowledgeSkills.findIndex((s) => s.name === skillName)
            if (index === -1) {
              prev.skills.knowledgeSkills.push(updater({ name: skillName, rating: 0 }))
            } else {
              prev.skills.knowledgeSkills[index] = updater(prev.skills.knowledgeSkills[index])
            }
          }))
        },
      },

      languageSkills: {
        remove: (languageName) => {
          store.setState(produce((prev) => {
            prev.skills.languageSkills = prev.skills.languageSkills.filter((s) => s.name !== languageName)
          }))
        },
        setState: (languageName, updater) => {
          store.setState(produce((prev) => {
            const index = prev.skills.languageSkills.findIndex((s) => s.name === languageName)
            if (index === -1) {
              prev.skills.languageSkills.push(updater({ name: languageName, rating: 0 }))
            } else {
              prev.skills.languageSkills[index] = updater(prev.skills.languageSkills[index])
            }
          }))
        },
      },
    }
  }, [store])
}
