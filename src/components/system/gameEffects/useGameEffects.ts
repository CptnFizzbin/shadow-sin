import { createSelector } from "reselect"

import type { CharacterDataSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { EffectByType, GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { filterByEffectType } from "#/system/gameEffects/gameEffectUtils.ts"

function getGameEffects(item: { effects?: GameEffectData[] }): GameEffectData[] {
  return item.effects ?? []
}

export const selectAllGameEffects: CharacterDataSelector<GameEffectData[]> = createSelector(
  [
    (sheet: CharacterSheet) => sheet.qualities,
    (sheet: CharacterSheet) => sheet.gear,
    (sheet: CharacterSheet) => sheet.spells,
    (sheet: CharacterSheet) => sheet.complexForms,
    (sheet: CharacterSheet) => sheet.powers,
  ],
  (qualities, gear, spells, complexForms, powers): GameEffectData[] => {
    const equippedGear = Object.values(gear).filter((gearItem) => gearItem.equipped)

    return [
      ...qualities,
      ...equippedGear,
      ...spells,
      ...complexForms,
      ...powers,
    ].flatMap(getGameEffects)
  },
)

interface TypedGameEffectSelector {
  <TType extends GameEffectType>(type: TType): CharacterDataSelector<EffectByType[TType][]>
}

export const selectGameEffectsByType: TypedGameEffectSelector = createCurriedSelector(
  [
    selectAllGameEffects,
    (_, type: keyof EffectByType) => type,
  ],
  (allEffects, type) => {
    return allEffects.filter(filterByEffectType(type))
  },
)

/**
 * Hook to retrieve all game effects of a specific type from the character sheet.
 * This scans qualities, gear, spells, complex forms, and powers.
 */
export function useGameEffects<T extends keyof EffectByType>(type: T): EffectByType[T][] {
  return useCharacterSheetSelector(selectGameEffectsByType(type))
}
