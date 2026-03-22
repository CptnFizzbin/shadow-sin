import type { FC } from "react"

import { ActiveSkillsList } from "#/components/CharacterBuilder/Skills/ActiveSkillsList.tsx"
import { useActiveSkillsFormGroup } from "#/components/CharacterBuilder/Skills/UseActiveSkillsFormGroup.ts"

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
  } = useActiveSkillsFormGroup()

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
