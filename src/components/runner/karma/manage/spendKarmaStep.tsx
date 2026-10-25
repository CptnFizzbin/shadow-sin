import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"
import { useState } from "react"

import { SpendKarmaDialogFooter } from "#/components/runner/karma/improvements/spendKarmaDialogFooter.tsx"
import { SpendKarmaHubList } from "#/components/runner/karma/improvements/spendKarmaHubList.tsx"
import type { SpendKarmaSectionKey } from "#/components/runner/karma/improvements/spendKarmaSections.tsx"
import { SpendKarmaSectionContent } from "#/components/runner/karma/improvements/spendKarmaSections.tsx"
import { SpendKarmaDialogProvider } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useSpendKarmaSummary } from "#/hooks/improvements/useSpendKarmaSummary.ts"
import { useVisibleSections } from "#/hooks/improvements/useVisibleSections.ts"

import { ManageKarmaStepDialog } from "./manageKarmaStepDialog.tsx"
import { ManageKarmaStepHeader } from "./manageKarmaStepHeader.tsx"
import type { ManageKarmaStepProps } from "./manageKarmaStepProps.ts"

const SpendKarmaStepInner: FC<ManageKarmaStepProps> = ({ ctrl, onBack }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const visibleSections = useVisibleSections()
  const { saveImprovements } = useSpendKarmaSummary()

  const [activeSection, setActiveSection] = useState<SpendKarmaSectionKey | null>(null)
  const activeSectionConfig = visibleSections.find(
    (section) => section.key === activeSection,
  ) ?? null

  const handleSave = () => {
    saveImprovements()
    ctrl.close()
  }

  return (
    <ManageKarmaStepDialog ctrl={ctrl} fullScreen={isNarrowViewport}>
      <Dialog.Title>
        {activeSectionConfig
          ? (
              <ManageKarmaStepHeader
                title={activeSectionConfig.label}
                onBack={() => setActiveSection(null)}
                backLabel="Back to categories"
              />
            )
          : <ManageKarmaStepHeader title="Spend Karma" onBack={onBack} />}
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
    </ManageKarmaStepDialog>
  )
}

/**
 * Manage Karma step for queueing improvements and paying for them with karma. Queued improvements
 * are discarded when the step is left without saving.
 */
export const SpendKarmaStep: FC<ManageKarmaStepProps> = (props) => (
  <SpendKarmaDialogProvider>
    <SpendKarmaStepInner {...props} />
  </SpendKarmaDialogProvider>
)
