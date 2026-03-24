import type { FC } from "react"

import { KnowledgeSkillsList } from "#/components/CharacterBuilder/Skills/KnowledgeSkillsList.tsx"
import { useKnowledgeSkillsState } from "#/components/CharacterBuilder/Skills/UseKnowledgeSkillsState.ts"

export const KnowledgeSkillsFormGroup: FC = () => {
  const {
    knowledgeSkills,
    languageSkills,
    freeSkillPoints,
    maxSkillPoints,
    totalSpUsed,
    extraSpBp,
    knowledgeSkillWarnings,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
    addLanguageSkill,
    updateLanguageSkill,
    removeLanguageSkill,
  } = useKnowledgeSkillsState()

  return (
    <KnowledgeSkillsList
      knowledgeSkills={knowledgeSkills}
      languageSkills={languageSkills}
      freeSkillPoints={freeSkillPoints}
      maxSkillPoints={maxSkillPoints}
      totalSpUsed={totalSpUsed}
      extraSpBp={extraSpBp}
      knowledgeSkillWarnings={knowledgeSkillWarnings}
      onAddKnowledgeSkill={addKnowledgeSkill}
      onUpdateKnowledgeSkill={updateKnowledgeSkill}
      onRemoveKnowledgeSkill={removeKnowledgeSkill}
      onAddLanguageSkill={addLanguageSkill}
      onUpdateLanguageSkill={updateLanguageSkill}
      onRemoveLanguageSkill={removeLanguageSkill}
    />
  )
}
