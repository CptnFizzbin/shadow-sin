import { useAppSelector } from "#/state/rootState.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export const useRunner = (): RunnerData => {
  return useAppSelector(({ runner }) => runner)
}

export const useItems = (): ItemCatalog => {
  return useAppSelector(({ items }) => items)
}
