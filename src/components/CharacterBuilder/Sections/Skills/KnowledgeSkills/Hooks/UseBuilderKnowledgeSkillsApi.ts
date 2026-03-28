import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type {
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"
import {
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
  getMaxSkillPoints,
} from "#/components/CharacterBuilder/Sections/Skills/SkillUtils.ts"

export function useBuilderKnowledgeSkillsApi() {
  const store = useCharacterBuilderStoreContext()
  const knowledgeSkills = useStore(store, (state) => state.skills.knowledgeSkills)
  const languageSkills = useStore(store, (state) => state.skills.languageSkills)
  const logicValue = useCharacterBuilderStore((s) => s.attributes.logic.value)
  const intuitionValue = useCharacterBuilderStore((s) => s.attributes.intuition.value)

  const freeSkillPoints = getFreeSkillPoints(logicValue, intuitionValue)
  const maxSkillPoints = getMaxSkillPoints(logicValue, intuitionValue)
  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(knowledgeSkills, languageSkills)
  const extraSpNeeded = Math.max(0, totalSpUsed - freeSkillPoints)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

  return {
    knowledgeSkills,
    languageSkills,
    freeSkillPoints,
    maxSkillPoints,
    totalSpUsed,
    extraSpNeeded,
    extraSpBp,

    addKnowledgeSkill(skill: KnowledgeSkillFormState) {
      store.setState(produce((draft) => {
        draft.skills.knowledgeSkills.push(skill)
      }))
    },

    updateKnowledgeSkill(skill: KnowledgeSkillFormState) {
      store.setState(produce((draft) => {
        draft.skills.knowledgeSkills = draft.skills.knowledgeSkills.map((s) =>
          s.id === skill.id ? skill : s,
        )
      }))
    },

    removeKnowledgeSkill(skillId: string) {
      store.setState(produce((draft) => {
        draft.skills.knowledgeSkills = draft.skills.knowledgeSkills.filter(
          (s) => s.id !== skillId,
        )
      }))
    },

    addLanguageSkill(skill: LanguageSkillFormState) {
      store.setState(produce((draft) => {
        draft.skills.languageSkills.push(skill)
      }))
    },

    updateLanguageSkill(skill: LanguageSkillFormState) {
      store.setState(produce((draft) => {
        draft.skills.languageSkills = draft.skills.languageSkills.map((s) =>
          s.id === skill.id ? skill : s,
        )
      }))
    },

    removeLanguageSkill(skillId: string) {
      store.setState(produce((draft) => {
        draft.skills.languageSkills = draft.skills.languageSkills.filter(
          (s) => s.id !== skillId,
        )
      }))
    },
  }
}
