import type { FC, PropsWithChildren } from "react"

import { RunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { RunnerAttributesProvider } from "./runnerAttributesProvider.tsx"
import { useRunnerDataSelector } from "./runnerData.selectors.ts"
import { RunnerDataContext, useRunnerDataContext } from "./runnerDataContext.ts"
import type { RunnerDataStore } from "./runnerDataStore.ts"

export { useRunnerDataContext }

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerDataStore
}

/**
 * Provides both the legacy `RunnerDataContext` and the new `RunnerStoreContext` off the same
 * `store` instance, so `StoreSlice`-based hooks and `useRunnerStoreSelector`/`useRunnerStoreDispatch`
 * can coexist while call sites are migrated one domain at a time.
 */
export const RunnerDataProvider: FC<RunnerDataProviderProps> = ({
  store,
  children,
}) => {
  return (
    <RunnerDataContext.Provider value={store}>
      <RunnerStoreContext.Provider value={store}>
        <RunnerAttributesProvider>
          {children}
        </RunnerAttributesProvider>
      </RunnerStoreContext.Provider>
    </RunnerDataContext.Provider>
  )
}

type RunnerDataSelector<TData> = (state: RunnerData) => TData

/**
 * @deprecated use {@link useRunnerDataSelector} instead
 * @param selector
 */
export function useRunnerData<TData>(
  selector: RunnerDataSelector<TData>,
) {
  return useRunnerDataSelector(selector)
}
