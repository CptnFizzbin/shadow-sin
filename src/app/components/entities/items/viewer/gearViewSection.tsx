import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import type { FC } from "react"
import { useContext, useState } from "react"

import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { CyberwareSectionHeader } from "./cyberwareSectionHeader.tsx"
import { GearListFilterContext } from "./gearListFilter.ts"
import { GearSection, getSectionTopLevelItems } from "./gearSectionTypes.ts"
import { GearViewSectionContent } from "./gearViewSectionContent.tsx"

interface GearViewSectionProps {
  section: GearSection
  /** Expands the section regardless of whether the Player collapsed it, e.g. while searching. */
  forceExpanded?: boolean
}

export const GearViewSection: FC<GearViewSectionProps> = ({ section, forceExpanded = false }) => {
  const [isManuallyOpen, setIsManuallyOpen] = useState(true)
  const allGearItems = useRunnerSelector(ItemSelectors.selectAll)
  const filter = useContext(GearListFilterContext)

  const topLevelItems = getSectionTopLevelItems(section, Object.values(allGearItems))
  const sectionItems = filter ? topLevelItems.filter(filter.includes) : topLevelItems

  if (sectionItems.length === 0) return null

  const isExpanded = forceExpanded || isManuallyOpen

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={isExpanded}
      onChange={(_, expanded) => {
        if (!forceExpanded) setIsManuallyOpen(expanded)
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
            justifyContent: "space-between",
            flexGrow: 1,
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
