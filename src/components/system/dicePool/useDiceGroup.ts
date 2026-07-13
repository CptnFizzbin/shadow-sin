import { useId } from "react"

import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { useActiveSkillRating } from "#/components/runner/runnerUtils.ts"
import { useWoundModifier } from "#/components/system/damage/useWoundModifier.ts"
import { useEncumbrance } from "#/components/system/encumbrance/useEncumbrance.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import type { DiceGroup } from "./diceGroup.tsx"

export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  return { name: label, size: useAttrValue(attrKey) }
}

export function useActiveSkillDiceGroup(skillKey: SkillKey): DiceGroup {
  const skillRating = useActiveSkillRating(skillKey)
  const groupId = [skillKey, useId()].join("-")

  const skillMods = useGameEffects(GameEffectType.skillMod)
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

export function useEncumbranceDiceGroup(): DiceGroup | null {
  const { penalty } = useEncumbrance()
  if (penalty === 0) return null
  return { name: "Encumbrance", size: penalty * -1, color: "warning.main" }
}

export function useDefaultingDiceGroup(skillKey: SkillKey): DiceGroup | null {
  const skillRating = useActiveSkillRating(skillKey)
  const { defaultable } = skillList[skillKey]
  const isDefaulted = skillRating === 0 && (defaultable ?? true)
  if (!isDefaulted) return null
  return { id: `${skillKey}-defaulting`, name: "Defaulting", size: -1, color: "warning.main" }
}
