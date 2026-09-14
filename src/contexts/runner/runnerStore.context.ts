import { createContext, useContext } from "react"

import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { OutOfContextError } from "#/utils/errors/outOfContextError.ts"

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
