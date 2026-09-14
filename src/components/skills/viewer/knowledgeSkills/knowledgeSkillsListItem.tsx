import type { FC } from "react"

import { SkillListItem } from "#/components/skills/viewer/skillListItem.tsx"
import { useViewSkillDialog } from "#/components/skills/viewer/viewSkillDialog.tsx"
import { useKnowledgeSkillDicePool } from "#/hooks/runner/skills/skillDicePools.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { KnowledgeSkillData } from "#/system/model/skills/knowledgeSkillData.ts"

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
