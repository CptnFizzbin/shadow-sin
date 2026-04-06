import { useActiveSkillRating, useAttr } from "#/components/character/characterUtils.ts"
import { useWoundModifier } from "#/components/damage/useWoundModifier.ts"
import type { DiceGroup } from "#/components/dicePool/diceGroup.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"
import type { SkillKey } from "#/lib/system/skillKey.ts"

export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  return { name: label, size: useAttr(attrKey) }
}

export function useActiveSkillDiceGroup(skillKey: SkillKey): DiceGroup {
  return { name: skillKey, size: useActiveSkillRating(skillKey) }
}

export function useWoundDiceGroup(): DiceGroup | null {
  const woundMod = useWoundModifier()
  if (woundMod === 0) return null
  return { name: "Wound", size: woundMod * -1, color: "error.main" }
}
