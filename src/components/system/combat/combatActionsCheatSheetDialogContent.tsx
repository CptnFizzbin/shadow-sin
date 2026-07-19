import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import type { CombatActionCategory } from "./combatActionData.ts"
import { combatActionCategories } from "./combatActionData.ts"
import { CombatActionsCategoryList } from "./combatActionsCategoryList.tsx"
import { CombatActionsHubList } from "./combatActionsHubList.tsx"

export const CombatActionsCheatSheetDialogContent: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))

  // null = the hub (category list); a category = that category is drilled into.
  const [activeCategory, setActiveCategory] = useState<CombatActionCategory | null>(null)
  const activeCategoryInfo = combatActionCategories.find((info) => info.category === activeCategory) ?? null

  const goToHub = () => setActiveCategory(null)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport} onClosed={goToHub}>
      <Dialog.Title>
        {activeCategoryInfo
          ? (
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <IconButton aria-label="Back to categories" onClick={goToHub}>
                  <RiArrowLeftLine size={20} />
                </IconButton>
                <Box sx={{ flex: 1 }}>{activeCategoryInfo.label}</Box>
                {/* Spacer mirrors the back button so the title stays centered. */}
                <Box sx={{ width: 36 }} />
              </Stack>
            )
          : "Combat Actions Cheat Sheet"}
      </Dialog.Title>

      <Dialog.Content dividers>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          {activeCategory === null
            ? <CombatActionsHubList onSelectCategory={setActiveCategory} />
            : <CombatActionsCategoryList category={activeCategory} />}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
