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
    const mappedStore = createRootStore({
      mode,
      runner: store.getState(),
      onChange: (state) => {
        store.setState(() => toRunnerData(state))
      },
    })

    store.subscribe((runner) => {
      mappedStore.dispatch(RunnerActions.load(runner))
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
