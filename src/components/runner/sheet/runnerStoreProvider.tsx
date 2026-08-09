import type { FC, PropsWithChildren } from "react"

import { RootStoreContext } from "#/lib/contexts/root/rootStore.context.ts"
import { RunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"

import { RunnerAttributesProvider } from "./runnerAttributesProvider.tsx"
import type { RunnerDataStore } from "./runnerDataStore.ts"

interface RunnerDataProviderProps extends PropsWithChildren {
  store: RunnerDataStore
}

/**
 * Provides `RootStoreContext` (the merged root store) and `RunnerStoreContext` (the `RunnerData`
 * slice of it) off the given `store` instance, so `useRunnerStoreSelector`/`useRunnerStoreDispatch`
 * can read and write runner state.
 */
export const RunnerStoreProvider: FC<RunnerDataProviderProps> = ({
  store,
  children,
}) => {
  return (
    <RootStoreContext.Provider value={store.root}>
      <RunnerStoreContext.Provider value={store}>
        <RunnerAttributesProvider>
          {children}
        </RunnerAttributesProvider>
      </RunnerStoreContext.Provider>
    </RootStoreContext.Provider>
  )
}
