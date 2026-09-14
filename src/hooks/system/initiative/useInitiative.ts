import { useMemo } from "react"

import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { useEncumbrance } from "#/hooks/system/encumbrance/useEncumbrance.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"

interface InitiativeInfo {
  dicePool: number
  initiativePasses: number
}

export const useInitiative = (): InitiativeInfo => {
  const reactionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.reaction })
  const intuitionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.intuition })
  const initiativeBonuses = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.initiativeBonus })
  const extraPassEffects = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.extraInitiativePasses })
  const extraDiceEffects = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.extraInitiativeDice })
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
