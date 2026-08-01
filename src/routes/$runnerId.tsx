import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import { RiDice6Line } from "@remixicon/react"
import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { DiceTrayProvider } from "#/components/dice/diceTrayProvider.tsx"
import { RunnerNav } from "#/components/runner/nav/runnerNav.tsx"
import { QuickAccessButton } from "#/components/runner/quickPanel/quickAccessButton.tsx"
import { RunnerErrorRoute } from "#/components/runner/runnerErrorRoute.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { useDiceTray } from "#/lib/contexts/dice/diceTrayContext.ts"
import { useRunnerManager } from "#/lib/contexts/runner/runnerManagerContext.tsx"
import { useRunnerNav } from "#/lib/hooks/runner/nav/useRunnerNav.ts"
import { RunnerManager } from "#/lib/persistence/runnerManager.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { Route as ItemDetailsRoute } from "./$runnerId/item.$itemId.tsx"

// Module-level manager for use in loaders (outside React context)
const loaderManager = new RunnerManager({ local: LocalStorageProvider.getStorage() })

export const Route = createFileRoute("/$runnerId")({
  component: RunnerRoute,
  errorComponent: RunnerErrorRoute,
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
        <RunnerContent />
      </DiceTrayProvider>
    </RunnerStoreProvider>
  )
}

function RunnerContent() {
  const { nextPage, prevPage } = useRunnerNav()
  const diceTray = useDiceTray()
  const matches = useMatches()

  // The item details page is a drill-down, not a peer tab: `useRunnerNav`
  // has no entry for it (it falls back to "about"), so the tab bar and
  // swipe-between-sections chrome would misbehave here. Render it
  // full-screen instead — see ADR-0009.
  const isFullScreenRoute = matches.some((match) => match.routeId === ItemDetailsRoute.id)

  if (isFullScreenRoute) {
    return (
      <Box sx={{ padding: 1 }}>
        <Outlet />
      </Box>
    )
  }

  return (
    <>
      <RunnerNav />

      <SwipeSurface onSwipeRightToLeft={nextPage} onSwipeLeftToRight={prevPage}>
        <Box sx={{ padding: 1 }}>
          <Outlet />
        </Box>
      </SwipeSurface>

      <Box
        sx={{
          paddingX: 1,
          position: "sticky",
          bottom: 12,
          zIndex: "appBar",
        }}
      >
        <ButtonGroup variant="contained" color="secondary" fullWidth sx={{ borderRadius: 2 }}>
          <QuickAccessButton />

          <Button
            startIcon={<RiDice6Line size={18} />}
            onClick={() => diceTray.setDice(1)}
            aria-label="Open dice tray"
          >
            Dice Tray
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
