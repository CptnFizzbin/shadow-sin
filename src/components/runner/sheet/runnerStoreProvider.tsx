import type { FC, PropsWithChildren } from "react"

import { RunnerStoreContext } from "#/contexts/runner/runnerStore.context.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"

import { RunnerEntityProvider } from "./runnerEntityProvider.tsx"

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
      <RunnerEntityProvider>
        {children}
      </RunnerEntityProvider>
    </RunnerStoreContext.Provider>
  )
}
