import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import { RiDice6Line } from "@remixicon/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"

import { RunnerNav } from "#/components/runner/nav/runnerNav.tsx"
import { QuickAccessButton } from "#/components/runner/quickPanel/quickAccessButton.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { useDiceTray } from "#/lib/contexts/dice/diceTrayContext.ts"
import { useRunnerNav } from "#/lib/hooks/runner/nav/useRunnerNav.ts"

/**
 * The tabbed-sheet chrome: `RunnerNav` and the swipe-between-sections
 * surface. A pathless layout so it doesn't add a URL segment — sibling to
 * `_details`, which renders full-screen drill-down pages without this
 * chrome (see ADR-0009).
 */
export const Route = createFileRoute("/$runnerId/_viewer")({
  component: ViewerLayout,
})

function ViewerLayout() {
  const { nextPage, prevPage } = useRunnerNav()
  const diceTray = useDiceTray()

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
