import type { FC } from "react"
import { useState } from "react"

import { useKnowledgeSkillDicePool } from "#/components/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/skills/skillListItem.tsx"
import { ViewSkillDialog } from "#/components/skills/viewSkillDialog.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { KnowledgeSkillData } from "#/lib/system/skillData.ts"

interface KnowledgeSkillListItemProps {
  skill: KnowledgeSkillData
}

export const KnowledgeSkillsListItem: FC<KnowledgeSkillListItemProps> = ({ skill }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const skillDicePool = useKnowledgeSkillDicePool({
    knowledge: skill.name,
    rating: skill.rating,
  })

  const specializationDicePool = useKnowledgeSkillDicePool({
    knowledge: skill.name,
    rating: skill.rating,
    specialization: skill.specialization,
  })

  return (
    <>
      <SkillListItem
        name={skill.name}
        rating={skill.rating}
        specialization={skill.specialization}
        attr={AttributeKey.logic}
        onClick={() => setDialogOpen(true)}
      />

      <ViewSkillDialog
        name={skill.name}
        dicePools={[
          skillDicePool,
          skill.specialization ? specializationDicePool : false,
        ]}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
