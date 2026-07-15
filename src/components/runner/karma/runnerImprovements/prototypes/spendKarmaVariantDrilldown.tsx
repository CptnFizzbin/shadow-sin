// PROTOTYPE — Variant: hub-and-spoke drill-down. The dialog opens on a hub
// list of categories (with queued badges); tapping one replaces the whole view
// with that section and a back button in the title. See
// spendKarmaDialogPrototypes.tsx; delete alongside it.
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import { SpendKarmaPrototypeFooter } from "./spendKarmaPrototypeFooter.tsx"
import type { SpendKarmaSectionKey } from "./spendKarmaSections.tsx"
import { SpendKarmaSectionContent } from "./spendKarmaSections.tsx"
import { useSectionQueuedSummaries } from "./useSectionQueuedSummaries.ts"
import { useSpendKarmaSummary } from "./useSpendKarmaSummary.ts"
import { useVisibleSections } from "./useVisibleSections.ts"

export const SpendKarmaVariantDrilldown: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const visibleSections = useVisibleSections()
  const sectionSummaries = useSectionQueuedSummaries()
  const { saveImprovements } = useSpendKarmaSummary()

  const [activeSection, setActiveSection] = useState<SpendKarmaSectionKey | null>(null)
  const activeSectionConfig = visibleSections.find(
    (section) => section.key === activeSection,
  ) ?? null

  const handleSave = () => {
    saveImprovements()
    ctrl.close()
  }

  const goToHub = () => setActiveSection(null)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport} onClose={false}>
      <Dialog.Title>
        {activeSectionConfig
          ? (
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <IconButton aria-label="Back" onClick={goToHub}>
                  <RiArrowLeftLine size={20} />
                </IconButton>
                <Box sx={{ flex: 1 }}>{activeSectionConfig.label}</Box>
                {/* Spacer mirrors the back button so the title stays centered. */}
                <Box sx={{ width: 36 }} />
              </Stack>
            )
          : "Spend Karma"}
      </Dialog.Title>

      <Dialog.Content>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          {activeSection === null
            ? (
                <Paper>
                  <List disablePadding>
                    {visibleSections.map(({ key, label, Icon }, index) => {
                      const queued = sectionSummaries[key]
                      return (
                        <ListItem
                          key={key}
                          disablePadding
                          divider={index < visibleSections.length - 1}
                          secondaryAction={(
                            <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
                              {queued.count > 0 && <KarmaChip amount={queued.cost} color="success" />}
                              <RiArrowRightSLine
                                size={18}
                                style={{ color: "var(--mui-palette-text-secondary)" }}
                              />
                            </Stack>
                          )}
                        >
                          <ListItemButton onClick={() => setActiveSection(key)} sx={{ minHeight: 56 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon size={20} />
                            </ListItemIcon>
                            <ListItemText
                              primary={label}
                              secondary={queued.count > 0 ? `${queued.count} queued` : undefined}
                            />
                          </ListItemButton>
                        </ListItem>
                      )
                    })}
                  </List>
                </Paper>
              )
            : <SpendKarmaSectionContent section={activeSection} onBack={goToHub} />}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <SpendKarmaPrototypeFooter onCancel={() => ctrl.close()} onSave={handleSave} />
      </Dialog.Actions>
    </ControlledDialog>
  )
}
