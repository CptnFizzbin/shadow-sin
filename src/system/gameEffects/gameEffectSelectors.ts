import { createSelector } from "reselect"

import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import type { EffectByType, GameEffectData } from "./gameEffectData.ts"
import type { GameEffectType } from "./gameEffectType.ts"
import { filterByEffectType } from "./gameEffectUtils.ts"

type GameEffectSelector<TData> = (state: RunnerData) => TData

function getGameEffects(item: { effects?: GameEffectData[] }): GameEffectData[] {
  return item.effects ?? []
}

export const selectAllGameEffects: GameEffectSelector<GameEffectData[]> = createSelector(
  [
    (sheet: RunnerData) => sheet.qualities,
    (sheet: RunnerData) => sheet.gear,
    (sheet: RunnerData) => sheet.spells,
    (sheet: RunnerData) => sheet.complexForms,
    (sheet: RunnerData) => sheet.powers,
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
  <TType extends GameEffectType>(type: TType): GameEffectSelector<EffectByType[TType][]>
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
