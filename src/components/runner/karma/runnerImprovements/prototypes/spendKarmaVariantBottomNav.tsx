// PROTOTYPE — Variant: mobile-app style. Cancel (X) and Save live in the
// header, section navigation is a bottom icon bar, and the budget strip sits
// above the content. See spendKarmaDialogPrototypes.tsx; delete alongside it.
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiCloseLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import type { SpendKarmaSectionKey } from "./spendKarmaSections.tsx"
import { SpendKarmaSectionContent } from "./spendKarmaSections.tsx"
import { useSpendKarmaSummary } from "./useSpendKarmaSummary.ts"
import { useVisibleSections } from "./useVisibleSections.ts"

export const SpendKarmaVariantBottomNav: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const visibleSections = useVisibleSections()
  const { remainingKarma, karmaCost, isOverBudget, canSave, saveImprovements } = useSpendKarmaSummary()

  const [activeSection, setActiveSection] = useState<SpendKarmaSectionKey>("attribute")

  const handleSave = () => {
    saveImprovements()
    ctrl.close()
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs" fullScreen={isNarrowViewport} onClose={false}>
      <Dialog.Title>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <IconButton aria-label="Cancel" onClick={() => ctrl.close()}>
            <RiCloseLine size={20} />
          </IconButton>
          <Box sx={{ flex: 1 }}>Spend Karma</Box>
          <Button variant="contained" color="secondary" disabled={!canSave} onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Dialog.Title>

      <Dialog.Content>
        <Stack
          direction="row"
          sx={{ gap: 1.5, alignItems: "center", justifyContent: "center", pb: 1 }}
        >
          <Typography variant="caption" color="text.secondary">Remaining</Typography>
          <KarmaChip
            amount={remainingKarma}
            color={isOverBudget ? "error" : karmaCost > 0 ? "primary" : "default"}
          />
          {karmaCost > 0 && (
            <>
              <Typography variant="caption" color="text.secondary">Cost</Typography>
              <KarmaValue amount={karmaCost} sx={{ fontWeight: "bold" }} />
            </>
          )}
        </Stack>

        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          <SpendKarmaSectionContent section={activeSection} />
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <BottomNavigation
          showLabels
          value={activeSection}
          onChange={(_event, newSection: SpendKarmaSectionKey) => setActiveSection(newSection)}
          sx={{ width: "100%", bgcolor: "transparent" }}
        >
          {visibleSections.map(({ key, shortLabel, Icon }) => (
            <BottomNavigationAction
              key={key}
              value={key}
              label={shortLabel}
              icon={<Icon size={20} />}
              sx={{ minWidth: 0, px: 0.5 }}
            />
          ))}
        </BottomNavigation>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
