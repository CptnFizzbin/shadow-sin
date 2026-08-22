import { useMemo } from "react"

import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { useEncumbrance } from "#/lib/hooks/system/encumbrance/useEncumbrance.ts"
import { useGameEffects } from "#/lib/hooks/system/gameEffects/useGameEffects.ts"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

interface InitiativeInfo {
  dicePool: number
  initiativePasses: number
}

export const useInitiative = (): InitiativeInfo => {
  const reactionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.reaction })
  const intuitionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.intuition })
  const initiativeBonuses = useGameEffects(GameEffectType.initiativeBonus)
  const extraPassEffects = useGameEffects(GameEffectType.extraInitiativePasses)
  const extraDiceEffects = useGameEffects(GameEffectType.extraInitiativeDice)
  const { penalty: encumbrancePenalty } = useEncumbrance()

  return useMemo(() => {
    const initiativeBonus = initiativeBonuses.reduce((sum, e) => sum + e.value, 0)
    const extraInitiativePasses = extraPassEffects.reduce((sum, e) => sum + e.value, 0)
    const extraDice = extraDiceEffects.reduce((sum, e) => sum + e.value, 0)

    return {
      dicePool: reactionAttr + intuitionAttr + initiativeBonus + extraDice - encumbrancePenalty,
      initiativePasses: 1 + extraInitiativePasses,
    }
  }, [reactionAttr, intuitionAttr, initiativeBonuses, extraPassEffects, extraDiceEffects, encumbrancePenalty])
}
