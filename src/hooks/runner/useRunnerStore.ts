import { useRunnerState } from "#/state/runnerState.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export const useRunner = (): RunnerData => {
  return useRunnerState(({ runner }) => runner)
}

export const useItems = (): ItemCatalog => {
  return useRunnerState(({ items }) => items)
}
