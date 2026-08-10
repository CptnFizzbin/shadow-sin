import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { selectWoundMod } from "#/lib/stores/runner/selectors/damage.selectors.ts"

export function useWoundModifier() {
  return useRunnerStoreSelector(selectWoundMod)
}
