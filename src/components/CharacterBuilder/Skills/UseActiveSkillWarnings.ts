import {
  getActiveSkillRatingWarnings,
  getActiveSkillSelectionWarnings,
} from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"
import { useBuilderActiveSkillsApi, useBuilderSkillGroupsApi } from "#/components/CharacterBuilder/Skills/UseSkillsApi.ts"

export const useActiveSkillWarnings = () => {
  const activeSkillsApi = useBuilderActiveSkillsApi()
  const skillGroupsApi = useBuilderSkillGroupsApi()

  const ratingWarnings = getActiveSkillRatingWarnings(
    activeSkillsApi.skills,
  )

  const selectionWarnings = getActiveSkillSelectionWarnings(
    activeSkillsApi.skills,
    skillGroupsApi.skillGroups,
  )

  return [
    ...ratingWarnings,
    ...selectionWarnings,
  ]
}
