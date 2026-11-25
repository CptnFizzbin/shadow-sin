import type { FC } from "react"

import { SkillListItem } from "#/components/skills/viewer/skillListItem.tsx"
import { useViewSkillDialog } from "#/components/skills/viewer/viewSkillDialog.tsx"
import { useLanguageSkillDicePool } from "#/hooks/runner/skills/skillDicePools.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { LanguageSkillData } from "#/system/model/skills/languageSkillData.ts"

interface LanguageSkillListItemProps {
  skill: LanguageSkillData
}

export const LanguageSkillListItem: FC<LanguageSkillListItemProps> = ({ skill }) => {
  const skillDicePool = useLanguageSkillDicePool({
    language: skill.name,
    isNative: skill.isNative,
    rating: skill.rating ?? 0,
  })

  const lingoDicePool = useLanguageSkillDicePool({
    language: skill.name,
    isNative: skill.isNative,
    rating: skill.rating ?? 0,
    lingo: skill.lingo,
  })

  const viewSkillDialog = useViewSkillDialog()

  const handleClick = () => {
    if (skill.isNative) return
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
        rating={skill.rating ?? 0}
        isNative={skill.isNative}
        specialization={skill.lingo}
        attr={AttributeKey.intuition}
        onClick={handleClick}
      />
      {viewSkillDialog.outlet}
    </>
  )
}
