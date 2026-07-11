import type { FC } from "react"

import { useLanguageSkillDicePool } from "#/components/runner/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/runner/skills/skillListItem.tsx"
import { useViewSkillDialog } from "#/components/runner/skills/viewSkillDialog.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

interface LanguageSkillListItemProps {
  skill: LanguageSkillData
}

export const LanguageSkillListItem: FC<LanguageSkillListItemProps> = ({ skill }) => {
  const skillDicePool = useLanguageSkillDicePool({
    language: skill.name,
    rating: skill.rating,
  })

  const lingoDicePool = useLanguageSkillDicePool({
    language: skill.name,
    rating: skill.rating,
    lingo: skill.lingo,
  })

  const viewSkillDialog = useViewSkillDialog()

  const handleClick = () => {
    if (skill.rating === "native") return
    viewSkillDialog.open({
      name: skill.name,
      dicePools: [
        skillDicePool,
        skill.lingo ? lingoDicePool : false,
      ],
    })
  }

  return (
    <>
      <SkillListItem
        name={skill.name}
        rating={skill.rating}
        specialization={skill.lingo}
        attr={AttributeKey.intuition}
        onClick={handleClick}
      />
      {viewSkillDialog.dialog}
    </>
  )
}
