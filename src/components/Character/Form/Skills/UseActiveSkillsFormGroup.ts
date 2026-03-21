import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import {
  calculateActiveSkillsBp,
  getActiveSkillRatingWarnings,
  getActiveSkillSelectionWarnings,
} from "#/components/Character/Form/Skills/SkillRequirements.ts"

export function useActiveSkillsFormGroup() {
  const skillsSlice = useCharacterBuilderStoreSlice((s) => s.skills)

  const totalActiveSkillsBp = calculateActiveSkillsBp(
    skillsSlice.state.activeSkills,
    skillsSlice.state.activeSkillGroups,
  )

  const ratingWarnings = getActiveSkillRatingWarnings(
    skillsSlice.state.activeSkills,
  )
  const selectionWarnings = getActiveSkillSelectionWarnings(
    skillsSlice.state.activeSkills,
    skillsSlice.state.activeSkillGroups,
  )

  const activeSkillWarnings = [...ratingWarnings, ...selectionWarnings]

  const addActiveSkill = (skill: ActiveSkillFormState) => {
    skillsSlice.update((draft) => {
      draft.activeSkills.push(skill)
    })
  }
  const updateActiveSkill = (skill: ActiveSkillFormState) => {
    skillsSlice.update((draft) => {
      draft.activeSkills = draft.activeSkills.map((s) =>
        s.id === skill.id ? skill : s,
      )
    })
  }
  const removeActiveSkill = (skillId: string) => {
    skillsSlice.update((draft) => {
      draft.activeSkills = draft.activeSkills.filter((s) => s.id !== skillId)
    })
  }

  const addActiveSkillGroup = (group: ActiveSkillGroupFormState) => {
    skillsSlice.update((draft) => {
      draft.activeSkillGroups.push(group)
    })
  }
  const updateActiveSkillGroup = (group: ActiveSkillGroupFormState) => {
    skillsSlice.update((draft) => {
      draft.activeSkillGroups = draft.activeSkillGroups.map((g) =>
        g.id === group.id ? group : g,
      )
    })
  }
  const removeActiveSkillGroup = (groupId: string) => {
    skillsSlice.update((draft) => {
      draft.activeSkillGroups = draft.activeSkillGroups.filter(
        (g) => g.id !== groupId,
      )
    })
  }

  return {
    activeSkills: skillsSlice.state.activeSkills,
    activeSkillGroups: skillsSlice.state.activeSkillGroups,
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
