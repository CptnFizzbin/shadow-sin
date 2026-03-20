import { useStore } from "@tanstack/react-store"

import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  calculateActiveSkillsBp,
  getActiveSkillRatingWarnings,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export function useActiveSkillsFormGroup(form: PlayerCharacterForm) {
  const activeSkills = useStore(form.store, (s) => s.values.skills.activeSkills)
  const activeSkillGroups = useStore(
    form.store,
    (s) => s.values.skills.activeSkillGroups,
  )

  const totalActiveSkillsBp = calculateActiveSkillsBp(
    activeSkills,
    activeSkillGroups,
  )

  const activeSkillWarnings = getActiveSkillRatingWarnings(activeSkills)

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

  return {
    activeSkills,
    activeSkillGroups,
    totalActiveSkillsBp,
    activeSkillWarnings,
    addActiveSkill,
    updateActiveSkill,
    removeActiveSkill,
    addActiveSkillGroup,
    updateActiveSkillGroup,
    removeActiveSkillGroup,
  }
}
