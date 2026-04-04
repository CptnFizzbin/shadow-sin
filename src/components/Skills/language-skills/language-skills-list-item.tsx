import type { FC } from "react"
import { useState } from "react"

import { useLanguageSkillDicePool } from "#/components/Skills/skill-dice-pools.ts"
import { SkillListItem } from "#/components/Skills/skill-list-item.tsx"
import { ViewSkillDialog } from "#/components/Skills/view-skill-dialog.tsx"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { LanguageSkillData } from "#/lib/system/skill-data.ts"

interface LanguageSkillListItemProps {
  skill: LanguageSkillData
}

export const LanguageSkillListItem: FC<LanguageSkillListItemProps> = ({ skill }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const skillDicePool = useLanguageSkillDicePool({
    language: skill.name,
    rating: skill.rating,
  })

  const lingoDicePool = useLanguageSkillDicePool({
    language: skill.name,
    rating: skill.rating,
    lingo: skill.lingo,
  })

  return (
    <>
      <SkillListItem
        name={skill.name}
        rating={skill.rating}
        specialization={skill.lingo}
        attr={AttributeKey.logic}
        onClick={() => setDialogOpen(true)}
      />

      {skill.rating !== "native" && (
        <ViewSkillDialog
          name={skill.name}
          dicePools={[
            skillDicePool,
            skill.lingo ? lingoDicePool : false,
          ]}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  )
}
