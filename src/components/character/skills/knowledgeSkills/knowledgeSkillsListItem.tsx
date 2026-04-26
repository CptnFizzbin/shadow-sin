import type { FC } from "react"

import { useKnowledgeSkillDicePool } from "#/components/character/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/character/skills/skillListItem.tsx"
import { useViewSkillDialog } from "#/components/character/skills/viewSkillDialog.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"

interface KnowledgeSkillListItemProps {
  skill: KnowledgeSkillData
}

export const KnowledgeSkillsListItem: FC<KnowledgeSkillListItemProps> = ({ skill }) => {
  const skillDicePool = useKnowledgeSkillDicePool({
    knowledge: skill.name,
    rating: skill.rating,
  })

  const specializationDicePool = useKnowledgeSkillDicePool({
    knowledge: skill.name,
    rating: skill.rating,
    specialization: skill.specialization,
  })

  const viewSkillDialog = useViewSkillDialog()

  return (
    <SkillListItem
      name={skill.name}
      rating={skill.rating}
      specialization={skill.specialization}
      attr={AttributeKey.logic}
      onClick={() => viewSkillDialog.open({
        name: skill.name,
        dicePools: [
          skillDicePool,
          skill.specialization ? specializationDicePool : false,
        ],
      })}
    />
  )
}
