import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useMemo } from "react"

import { AddItemDialogProvider } from "#/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { RunnerEntityProvider } from "#/components/runner/runnerEntityProvider.tsx"
import { RunnerErrorRoute } from "#/components/runner/runnerErrorRoute.tsx"
import { DiceTrayProvider } from "#/components/system/dice/diceTrayProvider.tsx"
import { useRunnerManager } from "#/hooks/runner/useRunnerManager.ts"
import { DiceTrayApi } from "#/services/dice/diceTrayApi.ts"
import { RunnerManager } from "#/services/persistence/runnerManager.ts"
import { LocalStorageProvider } from "#/services/storage/providers/localStorageProvider.ts"
import { AppStateProvider, createRootStore } from "#/state/rootState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

// Module-level manager for use in loaders (outside React context)
const loaderManager = new RunnerManager({ local: LocalStorageProvider.getStorage() })

/**
 * Loads the Runner and sets up its store/dice-tray context once, shared by
 * both child layouts: `_viewer` (the tabbed sheet, with `RunnerNav` and the
 * swipe surface) and `_details` (full-screen drill-down pages, e.g. item
 * details — see ADR-0009). Neither child layout adds a path segment, so
 * `/$runnerId/gear` and `/$runnerId/item/$itemId` are both direct children
 * of this route.
 */
export const Route = createFileRoute("/$runnerId")({
  component: RunnerRoute,
  errorComponent: RunnerErrorRoute,
  // Nothing outside this single-player app mutates persisted Runner data, so loader
  // data never goes stale on its own. Without this, the default staleTime (0) reruns
  // the loader on every navigation — including the no-op history entry
  // useCloseOnBrowserBack pushes/pops around dialogs — recreating RunnerDataStore from
  // storage that lags behind debounced writes and silently discarding just-dispatched
  // changes (e.g. removing a Spirit). See #401.
  staleTime: Infinity,
  loader: async ({ params }): Promise<RunnerData> => {
    const runner = await loaderManager.getRunner(params.runnerId)
    return runner
  },
})

function RunnerRoute() {
  const runner = Route.useLoaderData()
  const runnerManager = useRunnerManager()

  const store = useMemo(() => {
    return createRootStore({
      mode: "viewer",
      runner: runner,
      onChange: async (state) => {
        try {
          await runnerManager.save(toRunnerData(state))
        } catch (error) {
          console.error("Failed to save runner sheet.", error)
        }
      },
    })
  }, [runner, runnerManager])

  const diceTrayApi = useMemo(() => new DiceTrayApi(), [])

  return (
    <AppStateProvider store={store}>
      <RunnerEntityProvider>
        <DiceTrayProvider diceTrayApi={diceTrayApi}>
          <AddItemDialogProvider>
            <Outlet />
          </AddItemDialogProvider>
        </DiceTrayProvider>
      </RunnerEntityProvider>
    </AppStateProvider>
  )
}
