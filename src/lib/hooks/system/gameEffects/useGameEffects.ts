import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { EffectByType } from "#/system/gameEffects/gameEffectData.ts"
import { selectGameEffectsByType } from "#/system/gameEffects/gameEffectSelectors.ts"

/**
 * Hook to retrieve all game effects of a specific type from the runner sheet.
 * This scans qualities, gear, spells, complex forms, and powers.
 */
export function useGameEffects<T extends keyof EffectByType>(type: T): EffectByType[T][] {
  return useRunnerStoreSelector(selectGameEffectsByType(type))
}
