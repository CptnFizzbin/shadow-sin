import type { FC, PropsWithChildren } from "react"

import { RunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { RunnerAttributesProvider } from "./runnerAttributesProvider.tsx"
import { useRunnerDataSelector } from "./runnerData.selectors.ts"
import { useRunnerDataContext } from "./runnerDataContext.ts"

export { useRunnerDataContext }

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerStore
}

/**
 * Provides both the legacy `RunnerDataContext` and the new `RunnerStoreContext` off the same
 * `store` instance, so `StoreSlice`-based hooks and `useRunnerStoreSelector`/`useRunnerStoreDispatch`
 * can coexist while call sites are migrated one domain at a time.
 */
export const RunnerStoreProvider: FC<RunnerDataProviderProps> = ({
  store,
  children,
}) => {
  return (
    <RunnerStoreContext.Provider value={store}>
      <RunnerAttributesProvider>
        {children}
      </RunnerAttributesProvider>
    </RunnerStoreContext.Provider>
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
