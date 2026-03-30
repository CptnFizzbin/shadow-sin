import { useActiveSkill, useAttr } from "#/components/Character/CharacterUtils.ts"
import { useWoundModifier } from "#/components/Damage/UseWoundModifier.ts"
import type { DiceGroup } from "#/components/DicePool/DicePool.tsx"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"

export function useDiceAttributeGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  return { name: label, size: useAttr(attrKey) }
}

export function useDiceSkillGroup(skillKey: SkillKey): DiceGroup {
  return { name: skillKey, size: useActiveSkill(skillKey) }
}

export function useWoundDiceGroup(): DiceGroup | null {
  const woundMod = useWoundModifier()
  if (woundMod === 0) return null
  return { name: "Wound", size: woundMod * -1, color: "error.main" }
}
