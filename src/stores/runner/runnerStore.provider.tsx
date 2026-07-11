import type { FC, PropsWithChildren } from "react"

import { RunnerAttributesProvider } from "#/components/runner/sheet/runnerAttributesProvider.tsx"
import type { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { RunnerStoreContext, useRunnerDataContext } from "./runnerStore.context.ts"
import { useRunnerStoreSelector } from "./runnerStore.selectors.ts"

export { useRunnerDataContext }

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerDataStore
}

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
 * @deprecated use {@link useRunnerStoreSelector} instead
 * @param selector
 */
export function useRunnerData<TData>(
  selector: RunnerDataSelector<TData>,
) {
  return useRunnerStoreSelector(selector)
}
