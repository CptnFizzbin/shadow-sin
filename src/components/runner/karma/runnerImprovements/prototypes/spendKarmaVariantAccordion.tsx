// PROTOTYPE — Variant: no navigation chrome at all. Sections stack vertically
// as accordions in one scroll; each header shows the section's queued karma so
// closed sections stay glanceable. See spendKarmaDialogPrototypes.tsx; delete
// alongside it.
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowDownSLine } from "@remixicon/react"
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

export const SpendKarmaVariantAccordion: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const visibleSections = useVisibleSections()
  const sectionSummaries = useSectionQueuedSummaries()
  const { saveImprovements } = useSpendKarmaSummary()

  const [expandedSection, setExpandedSection] = useState<SpendKarmaSectionKey | null>("attribute")

  const handleSave = () => {
    saveImprovements()
    ctrl.close()
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport} onClose={false}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          {visibleSections.map(({ key, label, Icon }) => {
            const queued = sectionSummaries[key]
            return (
              <Accordion
                key={key}
                disableGutters
                expanded={expandedSection === key}
                onChange={(_event, isExpanded) => setExpandedSection(isExpanded ? key : null)}
              >
                <AccordionSummary expandIcon={<RiArrowDownSLine size={18} />}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: "center", flex: 1, mr: 1 }}>
                    <Icon size={18} />
                    <Typography sx={{ flex: 1 }}>{label}</Typography>
                    {queued.count > 0 && <KarmaChip amount={queued.cost} color="success" />}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <SpendKarmaSectionContent section={key} />
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <SpendKarmaPrototypeFooter onCancel={() => ctrl.close()} onSave={handleSave} />
      </Dialog.Actions>
    </ControlledDialog>
  )
}
