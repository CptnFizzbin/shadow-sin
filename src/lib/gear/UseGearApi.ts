import { useMemo } from "react"

import { useCharacterSheetSlice } from "#/components/Character/CharacterStoreProvider.tsx"
import type { GearApi } from "#/lib/gear/GearApi.ts"
import { createGearApi } from "#/lib/gear/GearApi.ts"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"
import type { CharacterSheet } from "#/lib/system/types/playerCharacterData.ts"

const gearSelector = (state: CharacterSheet) => state.gear

const gearSetter = (
  state: CharacterSheet,
  nextGear: Record<string, GearData>,
): CharacterSheet => ({ ...state, gear: nextGear })

/**
 * Returns a `GearApi` backed by the reactive character sheet store.
 *
 * All read operations reflect the current snapshot; `set` and `remove`
 * propagate mutations through Immer and trigger re-renders in any component
 * that subscribes to the affected slice.
 *
 * Must be called within a `CharacterStoreProvider`.
 */
export function useGearApi(): GearApi {
  const gearSlice = useCharacterSheetSlice(gearSelector, gearSetter)

  return useMemo(() => createGearApi(gearSlice), [gearSlice])
}
