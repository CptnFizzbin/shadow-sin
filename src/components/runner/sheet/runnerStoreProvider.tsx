import type { FC, PropsWithChildren } from "react"

import { RunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"
import type { RunnerStore } from "#/lib/stores/runner/runnerStore.ts"

import { RunnerAttributesProvider } from "./runnerAttributesProvider.tsx"

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerStore
}

/**
 * Provides `RunnerStoreContext` off the given `store` instance, so `useRunnerStoreSelector`/
 * `useRunnerStoreDispatch` can read and write runner state.
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
