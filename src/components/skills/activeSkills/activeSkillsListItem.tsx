import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useActiveSkillDicePool } from "#/components/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/skills/skillListItem.tsx"
import { ViewSkillDialog } from "#/components/skills/viewSkillDialog.tsx"
import type { SkillKey } from "#/lib/system/skillKey.ts"
import { skills } from "#/lib/system/skillKey.ts"

export interface ActiveSkillsListItemProps {
  skillKey: SkillKey
  rating: number
}

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({ skillKey, rating }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const skillInfo = skills[skillKey]
  const isDefaulted = rating === 0 && (skillInfo.defaultable ?? true)

  const skillDicePool = useActiveSkillDicePool({ skillKey })

  const specialization = useCharacterSheet((sheet) => {
    return sheet.skills
      .activeSkills
      .find((s) => s.name === skillKey)
      ?.specialization
  })

  const specializationDicePool = useActiveSkillDicePool({ skillKey, specialization })

  return (
    <>
      <SkillListItem
        name={skillKey}
        rating={rating}
        specialization={specialization}
        attr={skillInfo.attr}
        isDefaulted={isDefaulted}
        onClick={() => setDialogOpen(true)}
      />

      <ViewSkillDialog
        name={skillKey}
        dicePools={[
          skillDicePool,
          specialization ? specializationDicePool : false,
        ]}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
