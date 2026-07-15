// PROTOTYPE — Variant: horizontally scrollable top tabs replace the left nav
// rail, freeing the full dialog width for section content. Full-screen on
// narrow viewports. See spendKarmaDialogPrototypes.tsx; delete alongside it.
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import { SpendKarmaPrototypeFooter } from "./spendKarmaPrototypeFooter.tsx"
import type { SpendKarmaSectionKey } from "./spendKarmaSections.tsx"
import { SpendKarmaSectionContent } from "./spendKarmaSections.tsx"
import { useSpendKarmaSummary } from "./useSpendKarmaSummary.ts"
import { useVisibleSections } from "./useVisibleSections.ts"

export const SpendKarmaVariantTabs: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const visibleSections = useVisibleSections()
  const { saveImprovements } = useSpendKarmaSummary()

  const [activeSection, setActiveSection] = useState<SpendKarmaSectionKey>("attribute")

  const handleSave = () => {
    saveImprovements()
    ctrl.close()
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="md" fullScreen={isNarrowViewport} onClose={false}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          <Tabs
            value={activeSection}
            onChange={(_event, newSection: SpendKarmaSectionKey) => setActiveSection(newSection)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              // Pin the tabs while the section list scrolls underneath;
              // -8px cancels the DialogContent padding.
              position: "sticky",
              top: -8,
              zIndex: 1,
              bgcolor: "var(--mui-palette-background-paper)",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {visibleSections.map(({ key, label, Icon }) => (
              <Tab
                key={key}
                value={key}
                label={label}
                icon={<Icon size={16} />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            ))}
          </Tabs>

          <Box sx={{ pt: 1.5 }}>
            <SpendKarmaSectionContent section={activeSection} />
          </Box>
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <SpendKarmaPrototypeFooter onCancel={() => ctrl.close()} onSave={handleSave} />
      </Dialog.Actions>
    </ControlledDialog>
  )
}
