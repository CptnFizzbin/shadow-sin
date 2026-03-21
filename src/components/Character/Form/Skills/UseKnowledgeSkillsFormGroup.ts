import { useStore } from "@tanstack/react-store"

import type {
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getFreeSkillPoints,
  getKnowledgeSkillRatingWarnings,
  getLanguageSelectionWarnings,
  getMaxSkillPoints,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export function useKnowledgeSkillsFormGroup(form: PlayerCharacterForm) {
  const knowledgeSkills = useStore(
    form.store,
    (s) => s.values.skills.knowledgeSkills,
  )
  const languageSkills = useStore(
    form.store,
    (s) => s.values.skills.languageSkills,
  )
  const logicValue = useStore(
    form.store,
    (s) => s.values.attributes.logic.value,
  )
  const intuitionValue = useStore(
    form.store,
    (s) => s.values.attributes.intuition.value,
  )

  const freeSkillPoints = getFreeSkillPoints(logicValue, intuitionValue)
  const maxSkillPoints = getMaxSkillPoints(logicValue, intuitionValue)

  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    knowledgeSkills,
    languageSkills,
  )

  const extraSpNeeded = Math.max(0, totalSpUsed - freeSkillPoints)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)

  const knowledgeSkillWarnings = getKnowledgeSkillRatingWarnings(
    knowledgeSkills,
    languageSkills,
  )
  const languageSelectionWarnings = getLanguageSelectionWarnings(languageSkills)
  const mergedKnowledgeWarnings = [
    ...knowledgeSkillWarnings,
    ...languageSelectionWarnings,
  ]

  const addKnowledgeSkill = (skill: KnowledgeSkillFormState) => {
    form.setFieldValue("skills.knowledgeSkills", (prev) => [...prev, skill])
  }
  const updateKnowledgeSkill = (skill: KnowledgeSkillFormState) => {
    form.setFieldValue("skills.knowledgeSkills", (prev) =>
      prev.map((s) => (s.id === skill.id ? skill : s)),
    )
  }
  const removeKnowledgeSkill = (skillId: string) => {
    form.setFieldValue("skills.knowledgeSkills", (prev) =>
      prev.filter((s) => s.id !== skillId),
    )
  }

  const addLanguageSkill = (skill: LanguageSkillFormState) => {
    form.setFieldValue("skills.languageSkills", (prev) => [...prev, skill])
  }
  const updateLanguageSkill = (skill: LanguageSkillFormState) => {
    form.setFieldValue("skills.languageSkills", (prev) =>
      prev.map((s) => (s.id === skill.id ? skill : s)),
    )
  }
  const removeLanguageSkill = (skillId: string) => {
    form.setFieldValue("skills.languageSkills", (prev) =>
      prev.filter((s) => s.id !== skillId),
    )
  }

  return {
    knowledgeSkills,
    languageSkills,
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
