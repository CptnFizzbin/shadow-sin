import { useId } from "react"

import { useActiveSkillRating, useAttr } from "#/components/character/characterUtils.ts"
import { useWoundModifier } from "#/components/system/damage/useWoundModifier.ts"
import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import type { SkillModEffect } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  return { name: label, size: useAttr(attrKey) }
}

export function useActiveSkillDiceGroup(skillKey: SkillKey): DiceGroup {
  const skillRating = useActiveSkillRating(skillKey)
  const groupId = [skillKey, useId()].join("-")

  const skillMods = useGameEffects<SkillModEffect>(GameEffectType.skillMod)
  const totalMod = skillMods
    .filter((e) => e.target === skillKey)
    .reduce((sum, e) => sum + e.value, 0)

  if (skillRating >= 1) {
    return { id: groupId, name: skillKey, size: skillRating + totalMod }
  }

  return { id: groupId, name: skillKey, size: totalMod }
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
