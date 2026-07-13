import { useRunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"

/** @deprecated - use {@link useRunnerStoreContext} instead */
export const useRunnerDataContext = (): RunnerStore => {
  return useRunnerStoreContext()
}
