import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import { RiDice6Line } from "@remixicon/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"

import { ItemBulkActionSlot } from "#/components/entities/items/selection/itemBulkActionSlot.tsx"
import { ItemSelectionProvider } from "#/components/entities/items/selection/itemSelectionProvider.tsx"
import { RunnerHeaderSummary } from "#/components/runner/header/runnerHeaderSummary.tsx"
import { useDiceTray } from "#/components/system/dice/diceTrayContext.ts"
import { RunnerNav } from "#/components/ui/nav/viewer/runnerNav.tsx"
import { QuickAccessButton } from "#/components/ui/quickPanel/quickAccessButton.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { useRunnerNav } from "#/hooks/runner/nav/useRunnerNav.ts"
import { useDocumentTitle } from "#/hooks/ui/useDocumentTitle.ts"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

/**
 * The tabbed-sheet chrome: `RunnerNav` and the swipe-between-sections
 * surface. A pathless layout so it doesn't add a URL segment — sibling to
 * `_details`, which renders full-screen drill-down pages without this
 * chrome (see ADR-0009). Sets the browser tab title to the viewed Runner's
 * alias (or name, if no alias is set) for as long as this layout is mounted. While the Gear page is
 * in selection mode, its bulk action bar takes the bottom bar's place.
 */
export const Route = createFileRoute("/$runnerId/_viewer")({
  component: ViewerLayout,
})

function ViewerLayout() {
  const { nextPage, prevPage } = useRunnerNav()
  const diceTray = useDiceTray()
  const displayName = useRunnerSelector(ProfileSelectors.selectDisplayName)
  useDocumentTitle(`${displayName} - ShadowSIN`)

  return (
    <ItemSelectionProvider>
      <RunnerHeaderSummary />
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
        <ItemBulkActionSlot>
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
        </ItemBulkActionSlot>
      </Box>
    </ItemSelectionProvider>
  )
}
