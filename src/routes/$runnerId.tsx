import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { DiceTrayProvider } from "#/components/dice/diceTrayProvider.tsx"
import { RunnerErrorRoute } from "#/components/runner/runnerErrorRoute.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { useRunnerManager } from "#/lib/contexts/runner/runnerManagerContext.tsx"
import { RunnerManager } from "#/lib/persistence/runnerManager.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
  // Loader data is never invalidated by anything outside this app (no
  // multiplayer sync yet), so treat it as always-fresh. Without this, TanStack
  // Router's default staleTime of 0 reruns the loader on every navigation —
  // including the no-op history entry `useCloseOnBrowserBack` pushes/pops
  // around every dialog open/close — which recreates the `RunnerDataStore`
  // below from stale persisted data and silently discards any dispatch that
  // hasn't been flushed to storage yet (writes are debounced by 5s).
  staleTime: Infinity,
  loader: async ({ params }): Promise<RunnerData> => {
    const runner = await loaderManager.getRunner(params.runnerId)
    return runner
  },
})

function RunnerRoute() {
  const runner = Route.useLoaderData()
  const store = useMemo(() => new RunnerDataStore(runner), [runner])
  const diceTrayApi = useMemo(() => new DiceTrayApi(), [])
  const runnerManager = useRunnerManager()

  useEffect(() => {
    const { unsubscribe } = store.subscribe(async (sheet) => {
      try {
        await runnerManager.save(sheet)
      } catch (error) {
        console.error("Failed to save runner sheet.", error)
      }
    })

    return () => unsubscribe()
  }, [store, runnerManager])

  return (
    <RunnerStoreProvider store={store}>
      <DiceTrayProvider diceTrayApi={diceTrayApi}>
        <Outlet />
      </DiceTrayProvider>
    </RunnerStoreProvider>
  )
}
