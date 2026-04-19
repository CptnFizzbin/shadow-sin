import { useId } from "react"

import { useActiveSkillRating, useAttr } from "#/components/character/characterUtils.ts"
import { useWoundModifier } from "#/components/damage/useWoundModifier.ts"
import type { DiceGroup } from "#/components/dicePool/diceGroup.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"
import type { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { skillList } from "#/lib/system/skills/skillList.ts"

export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  return { name: label, size: useAttr(attrKey) }
}

export function useActiveSkillDiceGroup(skillKey: SkillKey): DiceGroup {
  const skillRating = useActiveSkillRating(skillKey)
  const groupId = [skillKey, useId()].join("-")

  if (skillRating >= 1) {
    return { id: groupId, name: skillKey, size: skillRating }
  }

  return { id: groupId, name: skillKey, size: 0 }
}

export function useWoundDiceGroup(): DiceGroup | null {
  const woundMod = useWoundModifier()
  if (woundMod === 0) return null
  return { name: "Wound", size: woundMod * -1, color: "error.main" }
}

export function useDefaultingDiceGroup(skillKey: SkillKey): DiceGroup | null {
  const skillRating = useActiveSkillRating(skillKey)
  const { defaultable } = skillList[skillKey]
  const isDefaulted = skillRating === 0 && (defaultable ?? true)
  if (!isDefaulted) return null
  return { name: "Defaulting", size: -1, color: "warning.main" }
}
