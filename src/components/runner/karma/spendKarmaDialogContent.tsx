import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { SpendKarmaDialogFooter } from "#/components/improvements/spendKarmaDialogFooter.tsx"
import { SpendKarmaHubList } from "#/components/improvements/spendKarmaHubList.tsx"
import type { SpendKarmaSectionKey } from "#/components/improvements/spendKarmaSections.tsx"
import { SpendKarmaSectionContent } from "#/components/improvements/spendKarmaSections.tsx"
import { useSpendKarmaSummary } from "#/components/improvements/useSpendKarmaSummary.ts"
import { useVisibleSections } from "#/components/improvements/useVisibleSections.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import {
  SpendKarmaDialogProvider,
  useSpendKarmaDialogContext,
} from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"

// Inner component that consumes SpendKarmaDialogProvider context
const SpendKarmaDialogInner: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const { improvementStore } = useSpendKarmaDialogContext()
  const visibleSections = useVisibleSections()
  const { saveImprovements } = useSpendKarmaSummary()

  // null = the hub (category list); a key = that section is drilled into.
  const [activeSection, setActiveSection] = useState<SpendKarmaSectionKey | null>(null)
  const activeSectionConfig = visibleSections.find(
    (section) => section.key === activeSection,
  ) ?? null

  const goToHub = () => setActiveSection(null)

  const handleSave = () => {
    saveImprovements()
    ctrl.close()
  }

  const handleClosed = () => {
    improvementStore.removeAll()
    setActiveSection(null)
  }

  return (
    <ControlledDialog
      ctrl={ctrl}
      maxWidth="sm"
      fullScreen={isNarrowViewport}
      onClose={false}
      onClosed={handleClosed}
    >
      <Dialog.Title>
        {activeSectionConfig
          ? (
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <IconButton aria-label="Back to categories" onClick={goToHub}>
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
            ? <SpendKarmaHubList onSelectSection={setActiveSection} />
            : <SpendKarmaSectionContent section={activeSection} />}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <SpendKarmaDialogFooter onCancel={() => ctrl.close()} onSave={handleSave} />
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const SpendKarmaDialogContent: FC<ControlledDialogProps> = ({ ctrl, onClose }) => (
  <SpendKarmaDialogProvider>
    <SpendKarmaDialogInner ctrl={ctrl} onClose={onClose} />
  </SpendKarmaDialogProvider>
)
