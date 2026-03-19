import { useStore } from "@tanstack/react-store"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getActiveSkillRatingWarnings,
  getFreeSkillPoints,
  getKnowledgeSkillRatingWarnings,
  getMaxSkillPoints,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export function useSkillsFormGroup(form: PlayerCharacterForm) {
  const activeSkills = useStore(form.store, (s) => s.values.skills.activeSkills)
  const activeSkillGroups = useStore(
    form.store,
    (s) => s.values.skills.activeSkillGroups,
  )
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

  // Active skills BP calculations
  const totalActiveSkillsBp = calculateActiveSkillsBp(
    activeSkills,
    activeSkillGroups,
  )

  // Knowledge & Language SP calculations
  const freeSkillPoints = getFreeSkillPoints(logicValue, intuitionValue)
  const maxSkillPoints = getMaxSkillPoints(logicValue, intuitionValue)

  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    knowledgeSkills,
    languageSkills,
  )

  const extraSpNeeded = Math.max(0, totalSpUsed - freeSkillPoints)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)
  const totalSkillsBp = totalActiveSkillsBp + extraSpBp

  // Validation warnings
  const activeSkillWarnings = getActiveSkillRatingWarnings(activeSkills)
  const knowledgeSkillWarnings = getKnowledgeSkillRatingWarnings(
    knowledgeSkills,
    languageSkills,
  )

  // CRUD operations
  const addActiveSkill = (skill: ActiveSkillFormState) => {
    form.setFieldValue("skills.activeSkills", (prev) => [...prev, skill])
  }
  const updateActiveSkill = (skill: ActiveSkillFormState) => {
    form.setFieldValue("skills.activeSkills", (prev) =>
      prev.map((s) => (s.id === skill.id ? skill : s)),
    )
  }
  const removeActiveSkill = (skillId: string) => {
    form.setFieldValue("skills.activeSkills", (prev) =>
      prev.filter((s) => s.id !== skillId),
    )
  }

  const addActiveSkillGroup = (group: ActiveSkillGroupFormState) => {
    form.setFieldValue("skills.activeSkillGroups", (prev) => [...prev, group])
  }
  const updateActiveSkillGroup = (group: ActiveSkillGroupFormState) => {
    form.setFieldValue("skills.activeSkillGroups", (prev) =>
      prev.map((g) => (g.id === group.id ? group : g)),
    )
  }
  const removeActiveSkillGroup = (groupId: string) => {
    form.setFieldValue("skills.activeSkillGroups", (prev) =>
      prev.filter((g) => g.id !== groupId),
    )
  }

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
    activeSkills,
    activeSkillGroups,
    knowledgeSkills,
    languageSkills,

    totalActiveSkillsBp,

    freeSkillPoints,
    maxSkillPoints,
    totalSpUsed,
    extraSpNeeded,
    extraSpBp,

    totalSkillsBp,

    activeSkillWarnings,
    knowledgeSkillWarnings,

    addActiveSkill,
    updateActiveSkill,
    removeActiveSkill,
    addActiveSkillGroup,
    updateActiveSkillGroup,
    removeActiveSkillGroup,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
    addLanguageSkill,
    updateLanguageSkill,
    removeLanguageSkill,
  }
}
