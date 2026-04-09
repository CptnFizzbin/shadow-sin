import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { GameEffectType } from "#/lib/system/gameEffects/gameEffectType.ts"

export interface InitiativeInfo {
  initiativeScore: number
  initiativePasses: number
  walkMovement: number
  runMovement: number
}

export const useInitiativeStore = (): InitiativeInfo => {
  const reactionAttr = useAttr(AttributeKey.reaction)
  const intuitionAttr = useAttr(AttributeKey.intuition)
  const agilityAttr = useAttr(AttributeKey.agility)

  const allEffects = useCharacterSheet((sheet) => [
    ...Object.values(sheet.gear).flatMap((item) => item.effects ?? []),
    ...sheet.qualities.flatMap((quality) => quality.effects ?? []),
    ...sheet.adeptPowers.flatMap((power) => power.effects ?? []),
  ])

  const initiativeBonus = allEffects
    .filter((effect) => effect.type === GameEffectType.initiativeBonus)
    .reduce((sum, effect) => sum + effect.value, 0)

  const extraInitiativePasses = allEffects
    .filter((effect) => effect.type === GameEffectType.extraInitiativePasses)
    .reduce((sum, effect) => sum + effect.value, 0)

  return {
    initiativeScore: reactionAttr + intuitionAttr + initiativeBonus,
    initiativePasses: 1 + extraInitiativePasses,
    walkMovement: agilityAttr * 2,
    runMovement: agilityAttr * 4,
  }
}
