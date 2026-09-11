import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const RunnerStoreContext = createContext<RunnerStore | null>(null)

export const useRunnerStoreContext = (): RunnerStore => {
  const store = useContext(RunnerStoreContext)

  if (!store) {
    throw new OutOfContextError("useRunnerStoreContext", "RunnerStoreProvider")
  }

  return store
}

export const useRunner = (): RunnerData => {
  return useRunnerStoreContext().getState()
}

export const useItems = (): ItemCatalog => {
  return useRunnerStoreContext().getState()._data_.items
}
