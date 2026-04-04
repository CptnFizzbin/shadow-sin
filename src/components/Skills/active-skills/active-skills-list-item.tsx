import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useActiveSkillDicePool } from "#/components/Skills/skill-dice-pools.ts"
import { SkillListItem } from "#/components/Skills/skill-list-item.tsx"
import { ViewSkillDialog } from "#/components/Skills/view-skill-dialog.tsx"
import type { SkillKey } from "#/lib/system/skill-key.ts"
import { skills } from "#/lib/system/skill-key.ts"

export interface ActiveSkillsListItemProps {
  skillKey: SkillKey
  rating: number
}

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({ skillKey, rating }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const skillInfo = skills[skillKey]
  const skillDicePool = useActiveSkillDicePool({ skillKey })

  const specializtion = useCharacterSheet((sheet) => {
    return sheet.skills
      .activeSkills
      .find((s) => s.name === skillKey)
      ?.specialization
  })

  const specializationDicePool = useActiveSkillDicePool({ skillKey, specializtion })

  return (
    <>
      <SkillListItem
        name={skillKey}
        rating={rating}
        specialization={specializtion}
        attr={skillInfo.attr}
        onClick={() => setDialogOpen(true)}
      />

      <ViewSkillDialog
        name={skillKey}
        dicePools={[
          skillDicePool,
          specializtion ? specializationDicePool : false,
        ]}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
