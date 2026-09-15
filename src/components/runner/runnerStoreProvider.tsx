import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"

import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
import type { RunnerState } from "#/state/runnerState.ts"
import { RunnerStateProvider, createRunnerStateStore } from "#/state/runnerState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"

import { RunnerEntityProvider } from "./runnerEntityProvider.tsx"

interface RunnerDataProviderProps extends PropsWithChildren {
  mode?: RunnerState["mode"]
  store: RunnerStore
}

/**
 * Bridges a test-isolation `store` (e.g. `RunnerDataStore`) into a real `RunnerState` singleton,
 * provided via `RunnerStateProvider` — so `useRunnerState`/`useRunnerStateDispatch` (and the
 * `useRunnerSelector`/`useRunnerStoreDispatch` wrappers built on them) work the same as they do
 * against the production singleton.
 */
export const RunnerStoreProvider: FC<RunnerDataProviderProps> = ({
  mode = "viewer",
  store,
  children,
}) => {
  const appStore = useMemo(() => {
    // `store` (a test-isolation seed, e.g. `RunnerDataStore`) and `mappedStore` (the singleton
    // `RunnerState` shape) mirror each other's `RunnerData`: writes to one flow to the other so
    // either can be read from or written to. Without `isApplyingExternalWrite`, each side's own
    // write would immediately echo back as a write to itself, looping forever — the write that
    // originates the change sets the flag so the echo triggered by its own mirroring is skipped,
    // instead of triggering another round-trip.
    let isApplyingExternalWrite = false

    const mappedStore = createRunnerStateStore({
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
    <RunnerStateProvider store={appStore}>
      <RunnerEntityProvider>
        {children}
      </RunnerEntityProvider>
    </RunnerStateProvider>
  )
}
