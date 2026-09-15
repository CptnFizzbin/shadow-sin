import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import type { RunnerState } from "#/state/runnerState.ts"
import { RunnerStateProvider, createRunnerStateStore } from "#/state/runnerState.ts"

import { RunnerEntityProvider } from "./runnerEntityProvider.tsx"

interface RunnerDataProviderProps extends PropsWithChildren {
  mode?: RunnerState["mode"]
  store: RunnerStore
}

/**
 * Provides a real `RunnerState` singleton, seeded from `store`'s current value, via
 * `RunnerStateProvider` — so `useRunnerState`/`useRunnerStateDispatch` (and the
 * `useRunnerSelector`/`useRunnerStoreDispatch` wrappers built on them) work the same as they do
 * against the production singleton. `store` (e.g. a test's `RunnerDataStore`) is redirected to
 * read/write through this same singleton's `runner` slice from then on, rather than keeping its
 * own value in sync alongside it — so a test that seeded `store` before rendering can still call
 * `store.getState()`/`store.setState(...)` afterward and see/drive the real store.
 */
export const RunnerStoreProvider: FC<RunnerDataProviderProps> = ({
  mode = "viewer",
  store,
  children,
}) => {
  const appStore = useMemo(() => {
    const mappedStore = createRunnerStateStore({
      mode,
      runner: store.getState(),
    })

    store.redirectTo({
      getState: () => mappedStore.getState().runner,
      setState: (updater) => mappedStore.dispatch(RunnerActions.update(updater)),
      subscribe: (listener) => {
        let previousRunner = mappedStore.getState().runner
        const unsubscribe = mappedStore.subscribe(() => {
          const nextRunner = mappedStore.getState().runner
          if (nextRunner === previousRunner) return
          previousRunner = nextRunner
          listener(nextRunner)
        })
        return { unsubscribe }
      },
    })

    return mappedStore
  }, [mode, store])

  return (
    <RunnerStateProvider store={appStore}>
      <RunnerEntityProvider>
        {children}
      </RunnerEntityProvider>
    </RunnerStateProvider>
  )
}
