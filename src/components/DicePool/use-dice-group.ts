import { useActiveSkillRating, useAttr } from "#/components/Character/character-utils.ts"
import { useWoundModifier } from "#/components/Damage/use-wound-modifier.ts"
import type { DiceGroup } from "#/components/DicePool/dice-group.tsx"
import type { AttributeKey } from "#/lib/system/attribute-key.ts"
import { AttributeLabels } from "#/lib/system/attribute-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"

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
