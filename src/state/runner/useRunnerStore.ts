import type { ItemCatalog } from "#/data/items/itemUtils.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { useRunnerState } from "#/state/runnerState.ts"

export const useRunner = (): RunnerData => {
  return useRunnerState(({ runner }) => runner)
}

export const useItems = (): ItemCatalog => {
  return useRunnerState(({ items }) => items)
}
