import { useMemo } from "react"

import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { GameEffectType } from "#data/gameEffects/gameEffectType.ts"
import { useEntitySelector } from "#state/entity/useEntitySelector.ts"
import { AttrSelectors } from "#state/runner/attributes/attributes.selector.ts"
import { GameEffectSelectors } from "#state/runner/gameEffects/useGameEffects.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

interface InitiativeInfo {
  dicePool: number
  initiativePasses: number
}

export const useInitiative = (): InitiativeInfo => {
  // Ratings, so attrMod GameEffects (e.g. an Adept's Improved Reflexes) count — Reaction's rating
  // already carries the Encumbrance penalty.
  const reactionAttr = useEntitySelector(AttrSelectors.selectRating, { attr: AttributeKey.reaction })
  const intuitionAttr = useEntitySelector(AttrSelectors.selectRating, { attr: AttributeKey.intuition })
  const initiativeBonuses = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.initiativeBonus })
  const extraPassEffects = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.extraInitiativePasses })
  const extraDiceEffects = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.extraInitiativeDice })

  return useMemo(() => {
    const initiativeBonus = initiativeBonuses.reduce((sum, e) => sum + e.value, 0)
    const extraInitiativePasses = extraPassEffects.reduce((sum, e) => sum + e.value, 0)
    const extraDice = extraDiceEffects.reduce((sum, e) => sum + e.value, 0)

    return {
      dicePool: reactionAttr + intuitionAttr + initiativeBonus + extraDice,
      initiativePasses: 1 + extraInitiativePasses,
    }
  }, [reactionAttr, intuitionAttr, initiativeBonuses, extraPassEffects, extraDiceEffects])
}
