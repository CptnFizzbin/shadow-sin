import { useId } from "react"

import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { useEncumbrance } from "#/hooks/system/encumbrance/useEncumbrance.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  const label = AttributeLabels[attrKey]
  const size = useEntitySelector(AttrSelectors.selectValue, { key: attrKey })
  return { name: label, size, type: "attribute" }
}

export function useActiveSkillDiceGroup(
  skillKey: SkillKey,
  { defaulting = true }: { defaulting?: boolean } = {},
): DiceGroup {
  const skillRating = useRunnerSelector(SkillsSelectors.selectValue, { skillName: skillKey })
  const groupId = [skillKey, useId()].join("-")

  const skillMods = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.skillMod })
  const totalMod = skillMods
    .filter((e) => e.target === skillKey)
    .reduce((sum, e) => sum + e.value, 0)

  if (skillRating >= 1) {
    return {
      id: groupId,
      name: skillKey,
      size: skillRating + totalMod,
      type: "skill",
    }
  }

  if (defaulting) {
    return {
      id: groupId,
      name: `${skillKey} - Defaulting`,
      size: -1,
      type: "defaulting",
    }
  }

  return {
    id: groupId,
    name: skillKey,
    size: totalMod,
    type: "skill",
  }
}

export function useWoundDiceGroup(): DiceGroup | null {
  const woundMod = useRunnerSelector(DamageSelectors.selectWoundMod)
  if (woundMod === 0) return null
  return { name: "Wound", size: woundMod * -1, type: "penalty" }
}

export function useEncumbranceDiceGroup(): DiceGroup | null {
  const { penalty } = useEncumbrance()
  if (penalty === 0) return null
  return { name: "Encumbrance", size: penalty * -1, type: "penalty" }
}

export function useDefaultingDiceGroup(skillKey: SkillKey): DiceGroup | null {
  const skillRating = useRunnerSelector(SkillsSelectors.selectValue, { skillName: skillKey })
  const { defaultable } = skillList[skillKey]
  const isDefaulted = skillRating === 0 && (defaultable ?? true)
  if (!isDefaulted) return null
  return { id: `${skillKey}-defaulting`, name: "Defaulting", size: -1, type: "defaulting" }
}
