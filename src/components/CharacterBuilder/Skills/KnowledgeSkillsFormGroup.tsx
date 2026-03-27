import type { FC } from "react"

import { KnowledgeSkillsList } from "#/components/CharacterBuilder/Skills/KnowledgeSkillsList.tsx"
import { useBuilderKnowledgeSkillsApi } from "#/components/CharacterBuilder/Skills/UseBuilderKnowledgeSkillsApi.ts"

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
  } = useBuilderKnowledgeSkillsApi()

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
