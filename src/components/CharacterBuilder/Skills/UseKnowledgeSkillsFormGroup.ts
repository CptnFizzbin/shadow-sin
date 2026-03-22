import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type {
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import {
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
  getKnowledgeSkillRatingWarnings,
  getLanguageSelectionWarnings,
  getMaxSkillPoints,
} from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"

export function useKnowledgeSkillsFormGroup() {
  const skillsSlice = useCharacterBuilderStoreSlice(
    (state) => state.skills,
    (state, skills) => {
      state.skills = skills
      return state
    },
  )
  const logicValue = useCharacterBuilderStore((s) => s.attributes.logic.value)
  const intuitionValue = useCharacterBuilderStore(
    (s) => s.attributes.intuition.value,
  )

  const freeSkillPoints = getFreeSkillPoints(logicValue, intuitionValue)
  const maxSkillPoints = getMaxSkillPoints(logicValue, intuitionValue)

  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    skillsSlice.state.knowledgeSkills,
    skillsSlice.state.languageSkills,
  )

  const extraSpNeeded = Math.max(0, totalSpUsed - freeSkillPoints)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

  const knowledgeSkillWarnings = getKnowledgeSkillRatingWarnings(
    skillsSlice.state.knowledgeSkills,
    skillsSlice.state.languageSkills,
  )
  const languageSelectionWarnings = getLanguageSelectionWarnings(
    skillsSlice.state.languageSkills,
  )
  const mergedKnowledgeWarnings = [
    ...knowledgeSkillWarnings,
    ...languageSelectionWarnings,
  ]

  const addKnowledgeSkill = (skill: KnowledgeSkillFormState) => {
    skillsSlice.update((draft) => {
      draft.knowledgeSkills.push(skill)
    })
  }

  const updateKnowledgeSkill = (skill: KnowledgeSkillFormState) => {
    skillsSlice.update((draft) => {
      draft.knowledgeSkills = draft.knowledgeSkills.map((s) =>
        s.id === skill.id ? skill : s,
      )
    })
  }
  const removeKnowledgeSkill = (skillId: string) => {
    skillsSlice.update((draft) => {
      draft.knowledgeSkills = draft.knowledgeSkills.filter(
        (s) => s.id !== skillId,
      )
    })
  }

  const addLanguageSkill = (skill: LanguageSkillFormState) => {
    skillsSlice.update((draft) => {
      draft.languageSkills.push(skill)
    })
  }
  const updateLanguageSkill = (skill: LanguageSkillFormState) => {
    skillsSlice.update((draft) => {
      draft.languageSkills = draft.languageSkills.map((s) =>
        s.id === skill.id ? skill : s,
      )
    })
  }
  const removeLanguageSkill = (skillId: string) => {
    skillsSlice.update((draft) => {
      draft.languageSkills = draft.languageSkills.filter(
        (s) => s.id !== skillId,
      )
    })
  }

  return {
    knowledgeSkills: skillsSlice.state.knowledgeSkills,
    languageSkills: skillsSlice.state.languageSkills,
    freeSkillPoints,
    maxSkillPoints,
    totalSpUsed,
    extraSpNeeded,
    extraSpBp,
    knowledgeSkillWarnings: mergedKnowledgeWarnings,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
    addLanguageSkill,
    updateLanguageSkill,
    removeLanguageSkill,
  }
}
