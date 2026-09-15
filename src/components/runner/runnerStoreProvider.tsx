import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import type { RootState } from "#/state/rootState.ts"
import { AppStateProvider, createRootStore } from "#/state/rootState.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"

import { RunnerEntityProvider } from "./runnerEntityProvider.tsx"

interface RunnerDataProviderProps extends PropsWithChildren {
  mode?: RootState["mode"]
  store: RunnerStore
}

/**
 * Provides `RunnerStoreContext` off the given `store` instance, so `useRunnerStoreSelector`/
 * `useRunnerStoreDispatch` can read and write runner state.
 */
export const RunnerStoreProvider: FC<RunnerDataProviderProps> = ({
  mode = "viewer",
  store,
  children,
}) => {
  const appStore = useMemo(() => {
    // `store` (a test-isolation seed, e.g. `RunnerDataStore`) and `mappedStore` (the singleton
    // `RootState` shape) mirror each other's `RunnerData`: writes to one flow to the other so
    // either can be read from or written to. Without `isApplyingExternalWrite`, each side's own
    // write would immediately echo back as a write to itself, looping forever — the write that
    // originates the change sets the flag so the echo triggered by its own mirroring is skipped,
    // instead of triggering another round-trip.
    let isApplyingExternalWrite = false

    const mappedStore = createRootStore({
      mode,
      runner: store.getState(),
      onChange: (state) => {
        if (isApplyingExternalWrite) return
        store.setState(() => toRunnerData(state))
      },
    })

    store.subscribe((runner) => {
      isApplyingExternalWrite = true
      try {
        mappedStore.dispatch(RunnerActions.load(runner))
      } finally {
        isApplyingExternalWrite = false
      }
    })

    return mappedStore
  }, [mode, store])

  return (
    <AppStateProvider store={appStore}>
      <RunnerEntityProvider>
        {children}
      </RunnerEntityProvider>
    </AppStateProvider>
  )
}
