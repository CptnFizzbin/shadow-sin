import type { FC } from "react"

import { KnowledgeSkillsList } from "#/components/Character/Form/Skills/KnowledgeSkillsList.tsx"
import { useKnowledgeSkillsFormGroup } from "#/components/Character/Form/Skills/UseKnowledgeSkillsFormGroup.ts"

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
  } = useKnowledgeSkillsFormGroup()

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
