import { useMemo } from "react"

import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

interface InitiativeInfo {
  dicePool: number
  initiativePasses: number
}

export const useInitiative = (): InitiativeInfo => {
  const reactionAttr = useAttr(AttributeKey.reaction)
  const intuitionAttr = useAttr(AttributeKey.intuition)
  const initiativeBonuses = useGameEffects(GameEffectType.initiativeBonus)
  const extraPassEffects = useGameEffects(GameEffectType.extraInitiativePasses)
  const extraDiceEffects = useGameEffects(GameEffectType.extraInitiativeDice)

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
