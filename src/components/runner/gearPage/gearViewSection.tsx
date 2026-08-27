import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { searchGear } from "#/hooks/items/gearHooks.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import type { ItemType } from "#/system/itemType.ts"

import { CyberwareSectionHeader } from "./cyberwareSectionHeader.tsx"
import { GearSection, sectionGearTypes } from "./gearSectionTypes.ts"
import { GearViewSectionContent } from "./gearViewSectionContent.tsx"

interface GearViewSectionProps {
  section: GearSection
  searchTerms: string[]
}

export const GearViewSection: FC<GearViewSectionProps> = ({ section, searchTerms }) => {
  const [isManuallyOpen, setIsManuallyOpen] = useState(false)
  const allGearItems = useRunnerSelector(ItemSelectors.selectAll)

  const allowedTypes = sectionGearTypes[section]
  const isSearching = searchTerms.length > 0

  const sectionItems = isSearching
    ? searchGear(allGearItems, searchTerms).filter((item) => allowedTypes.includes(item.itemType as ItemType))
    : Object.values(allGearItems).filter((item) => allowedTypes.includes(item.itemType as ItemType))

  if (isSearching && sectionItems.length === 0) return null

  const isExpanded = isSearching ? sectionItems.length > 0 : isManuallyOpen

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={isExpanded}
      onChange={(_, expanded) => {
        if (!isSearching) setIsManuallyOpen(expanded)
      }}
      sx={{
        "border": "1px solid",
        "borderColor": "divider",
        "& .MuiAccordionSummary-content": { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<RiArrowDownSLine />}
        sx={{ padding: 1, margin: 0, minHeight: "unset" }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between", flexGrow: 1,
            paddingRight: 1,
            marginRight: 1,
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row">
            <Typography color="secondary" sx={{ width: 24, textAlign: "right" }}>{sectionItems.length}</Typography>
            <Typography>{section}</Typography>
          </Stack>
          {section === GearSection.Cyberware && <CyberwareSectionHeader />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 1 }}>
        <GearViewSectionContent section={section} />
      </AccordionDetails>
    </Accordion>
  )
}
