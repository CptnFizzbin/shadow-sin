import { useId } from "react"

import { useActiveSkillRating, useAttr } from "#/components/character/characterUtils.ts"
import { useWoundModifier } from "#/components/damage/useWoundModifier.ts"
import type { DiceGroup, DiceGroupList } from "#/components/dicePool/diceGroup.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"
import type { SkillKey } from "#/lib/system/skills/skillKey.ts"

export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  return { name: label, size: useAttr(attrKey) }
}

export function useActiveSkillDiceGroup(skillKey: SkillKey): DiceGroupList {
  const skillRating = useActiveSkillRating(skillKey)
  const groupId = [skillKey, useId()].join("-")

  return [
    { id: groupId, name: skillKey, size: skillRating },
    skillRating === 0 && { id: `${groupId}-default`, name: "Defaulting", size: -1, color: "error.light" },
  ]
}

export function useWoundDiceGroup(): DiceGroup | null {
  const woundMod = useWoundModifier()
  if (woundMod === 0) return null
  return { name: "Wound", size: woundMod * -1, color: "error.main" }
}
