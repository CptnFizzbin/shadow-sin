import { createSelector } from "reselect"

import type { CharacterDataSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { EffectByType, GameEffectData, TemporaryEffectData } from "#/system/gameEffects/gameEffectData.ts"
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
    (sheet: CharacterSheet) => sheet.adeptPowers,
    (sheet: CharacterSheet) => sheet.temporaryEffects ?? [],
  ],
  (qualities, gear, spells, complexForms, adeptPowers, temporaryEffects): GameEffectData[] => {
    const equippedGear = Object.values(gear).filter((gearItem) => gearItem.equipped)
    const enabledTemporaryEffects = temporaryEffects.filter((effect) => effect.enabled)

    return [
      ...[...qualities, ...equippedGear, ...spells, ...complexForms, ...adeptPowers].flatMap(getGameEffects),
      ...enabledTemporaryEffects,
    ]
  },
)

export interface GameEffectWithSource {
  effect: GameEffectData
  /** Human-readable description of the source, e.g. "Quality: High Pain Tolerance". */
  source: string
  /** Set only for temporary effects — used for toggle/remove actions. */
  temporaryEffectId?: string
}

/**
 * Returns all game effects annotated with their source label.
 * Passive effects (qualities, gear, spells, etc.) show as read-only entries.
 * ALL temporary effects are included regardless of their enabled state so the
 * UI can render toggle switches.
 */
export const selectAllGameEffectsWithSource: CharacterDataSelector<GameEffectWithSource[]> = createSelector(
  [
    (sheet: CharacterSheet) => sheet.qualities,
    (sheet: CharacterSheet) => sheet.gear,
    (sheet: CharacterSheet) => sheet.spells,
    (sheet: CharacterSheet) => sheet.complexForms,
    (sheet: CharacterSheet) => sheet.adeptPowers,
    (sheet: CharacterSheet) => sheet.temporaryEffects ?? [],
  ],
  (qualities, gear, spells, complexForms, adeptPowers, temporaryEffects): GameEffectWithSource[] => {
    const equippedGear = Object.values(gear).filter((gearItem) => gearItem.equipped)

    const passiveSources: Array<{ items: Array<{ effects?: GameEffectData[], name?: string }>, prefix: string }> = [
      { items: qualities, prefix: "Quality" },
      { items: equippedGear, prefix: "Gear" },
      { items: spells, prefix: "Spell" },
      { items: complexForms, prefix: "Complex Form" },
      { items: adeptPowers, prefix: "Adept Power" },
    ]

    const passiveEffects: GameEffectWithSource[] = passiveSources.flatMap(({ items, prefix }) =>
      items.flatMap((item) =>
        (item.effects ?? []).map((effect) => ({
          effect,
          source: `${prefix}: ${item.name ?? "Unknown"}`,
        })),
      ),
    )

    const temporaryEffectEntries: GameEffectWithSource[] = temporaryEffects.map((tempEffect: TemporaryEffectData) => ({
      effect: tempEffect,
      source: `Temporary: ${tempEffect.label}`,
      temporaryEffectId: tempEffect.id,
    }))

    return [...passiveEffects, ...temporaryEffectEntries]
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
 * This scans qualities, gear, spells, complex forms, adept powers, and enabled
 * temporary effects.
 */
export function useGameEffects<T extends keyof EffectByType>(type: T): EffectByType[T][] {
  return useCharacterSheetSelector(selectGameEffectsByType(type))
}
