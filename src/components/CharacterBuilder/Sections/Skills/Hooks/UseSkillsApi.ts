import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"

export const useBuilderActiveSkillsApi = () => {
  const store = useCharacterBuilderStoreContext()
  const allSkills = useStore(store, (state) => state.skills)

  return {
    skills: allSkills.activeSkills,
    addSkill(skill: ActiveSkillFormState) {
      store.setState(produce((sheet) => {
        sheet.skills.activeSkills.push(skill)
      }))
    },
    updateSkill(skill: ActiveSkillFormState) {
      store.setState(produce((sheet) => {
        sheet.skills.activeSkills = sheet.skills.activeSkills
          .map((s) => s.id === skill.id ? skill : s)
      }))
    },
    removeSkill(skill: ActiveSkillFormState) {
      store.setState(produce((sheet) => {
        sheet.skills.activeSkills = sheet.skills.activeSkills
          .filter((s) => s.id !== skill.id)
      }))
    },
  }
}

export const useBuilderSkillGroupsApi = () => {
  const store = useCharacterBuilderStoreContext()
  const allSkills = useStore(store, (state) => state.skills)

  return {
    skillGroups: allSkills.activeSkillGroups,
    addGroup(group: ActiveSkillGroupFormState) {
      store.setState(produce((sheet) => {
        sheet.skills.activeSkillGroups.push(group)
      }))
    },
    updateGroup(group: ActiveSkillGroupFormState) {
      store.setState(produce((sheet) => {
        sheet.skills.activeSkillGroups = sheet.skills.activeSkillGroups
          .map((s) => s.id === group.id ? group : s)
      }))
    },
    removeGroup(group: ActiveSkillGroupFormState) {
      store.setState(produce((sheet) => {
        sheet.skills.activeSkillGroups = sheet.skills.activeSkillGroups
          .filter((s) => s.id !== group.id)
      }))
    },
  }
}
