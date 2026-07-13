import type { FC, PropsWithChildren } from "react"

import { RunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { RunnerAttributesProvider } from "./runnerAttributesProvider.tsx"
import { useRunnerDataSelector } from "./runnerData.selectors.ts"

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerStore
}

/**
 * Provides `RunnerStoreContext` off the given `store` instance, so `useRunnerStoreSelector`/
 * `useRunnerStoreDispatch` (and the deprecated `useRunnerData`/`useRunnerDataSelector` shims) can
 * read and write runner state.
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
