import { useMemo } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

export interface InitiativeInfo {
  initiativeScore: number
  initiativePasses: number
}

export const useInitiative = (): InitiativeInfo => {
  const reactionAttr = useAttr(AttributeKey.reaction)
  const intuitionAttr = useAttr(AttributeKey.intuition)

  const allEffects = useCharacterSheet((sheet) => [
    ...Object.values(sheet.gear).flatMap((item) => item.effects ?? []),
    ...sheet.qualities.flatMap((quality) => quality.effects ?? []),
    ...sheet.adeptPowers.flatMap((power) => power.effects ?? []),
  ])

  return useMemo(() => {
    const initiativeBonus = allEffects
      .filter((effect) => effect.type === GameEffectType.initiativeBonus)
      .reduce((sum, effect) => sum + effect.value, 0)

    const extraInitiativePasses = allEffects
      .filter((effect) => effect.type === GameEffectType.extraInitiativePasses)
      .reduce((sum, effect) => sum + effect.value, 0)

    return {
      initiativeScore: reactionAttr + intuitionAttr + initiativeBonus,
      initiativePasses: 1 + extraInitiativePasses,
    }
  }, [reactionAttr, intuitionAttr, allEffects])
}
