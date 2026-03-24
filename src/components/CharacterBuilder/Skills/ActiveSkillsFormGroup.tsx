import type { FC } from "react"

import { ActiveSkillsList } from "#/components/CharacterBuilder/Skills/ActiveSkillsList.tsx"
import { useActiveSkillsState } from "#/components/CharacterBuilder/Skills/UseActiveSkillsState.ts"

export const ActiveSkillsFormGroup: FC = () => {
  const {
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
  } = useActiveSkillsState()

  return (
    <ActiveSkillsList
      activeSkills={activeSkills}
      activeSkillGroups={activeSkillGroups}
      totalActiveSkillsBp={totalActiveSkillsBp}
      activeSkillWarnings={activeSkillWarnings}
      onAddSkill={addActiveSkill}
      onUpdateSkill={updateActiveSkill}
      onRemoveSkill={removeActiveSkill}
      onAddGroup={addActiveSkillGroup}
      onUpdateGroup={updateActiveSkillGroup}
      onRemoveGroup={removeActiveSkillGroup}
    />
  )
}
