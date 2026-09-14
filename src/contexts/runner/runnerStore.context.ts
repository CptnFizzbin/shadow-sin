import { createContext, useContext } from "react"

import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
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

/**
 * Reactive read of the whole Runner sheet — reads via `useSelector` (not `getState()`, which
 * gives a snapshot that won't trigger re-renders) so consumers (e.g. `RunnerEntityProvider`,
 * `useEntitySelector`) stay in sync with store updates instead of freezing at whatever `RunnerData`
 * happened to be current the last time they rendered for some unrelated reason.
 */
export const useRunner = (): RunnerData => {
  return useSelector(useRunnerStoreContext(), (runner) => runner)
}

export const useItems = (): ItemCatalog => {
  return useSelector(useRunnerStoreContext(), (runner) => runner._data_.items)
}
