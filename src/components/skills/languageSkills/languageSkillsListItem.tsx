import type { FC } from "react"
import { useState } from "react"

import { useLanguageSkillDicePool } from "#/components/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/skills/skillListItem.tsx"
import { ViewSkillDialog } from "#/components/skills/viewSkillDialog.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { LanguageSkillData } from "#/lib/system/skills/languageSkillData"

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
