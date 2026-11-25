import type { FC } from "react"

import { SkillListItem } from "#/app/components/skills/viewer/skillListItem.tsx"
import { useViewSkillDialog } from "#/app/components/skills/viewer/viewSkillDialog.tsx"
import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import type { KnowledgeSkillData } from "#/data/skills/knowledgeSkillData.ts"
import { useKnowledgeSkillDicePool } from "#/state/runner/dicePool/skillDicePools.ts"

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
    <>
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
      {viewSkillDialog.outlet}
    </>
  )
}
