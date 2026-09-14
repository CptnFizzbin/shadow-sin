import { useId } from "react"

import type { DiceGroup } from "#/components/dicePool/diceGroup.tsx"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { useEncumbrance } from "#/hooks/system/encumbrance/useEncumbrance.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

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
