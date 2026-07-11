import type { FC, PropsWithChildren } from "react"

import type { RunnerData } from "#/system/runnerData.ts"

import { RunnerAttributesProvider } from "./runnerAttributesProvider.tsx"
import { useRunnerDataSelector } from "./runnerData.selectors.ts"
import { RunnerDataContext, useRunnerDataContext } from "./runnerDataContext.ts"
import type { RunnerDataStore } from "./runnerDataStore.ts"

export { useRunnerDataContext }

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerDataStore
}

export const RunnerDataProvider: FC<RunnerDataProviderProps> = ({
  store,
  children,
}) => {
  return (
    <RunnerDataContext.Provider value={store}>
      <RunnerAttributesProvider>
        {children}
      </RunnerAttributesProvider>
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
