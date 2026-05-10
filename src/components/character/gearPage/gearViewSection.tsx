import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { selectAllGear } from "#/components/items/gearSelectors.ts"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { ItemType } from "#/system/itemType.ts"

import { CyberwareSectionHeader } from "./cyberwareSectionHeader.tsx"
import { GearSection, sectionGearTypes } from "./gearSectionTypes.ts"
import { GearViewSectionContent } from "./gearViewSectionContent.tsx"

interface GearViewSectionProps {
  section: GearSection
  searchTerms: string[]
}

function getSectionItems(
  isSearching: boolean,
  searchTerms: string[],
  allowedTypes: ItemType[],
  allGearItems: ReturnType<typeof selectAllGear>,
  gearStore: ReturnType<typeof useGearStore>,
) {
  return isSearching
    ? gearStore.search(searchTerms).filter((item) => allowedTypes.includes(item.itemType as ItemType))
    : Object.values(allGearItems).filter((item) => allowedTypes.includes(item.itemType as ItemType))
}

function createGetChildItems(sectionItems: ReturnType<typeof getSectionItems>) {
  return (parentId: string) => sectionItems.filter((item) => item.parentId === parentId)
}

export const GearViewSection: FC<GearViewSectionProps> = ({ section, searchTerms }) => {
  const [isManuallyOpen, setIsManuallyOpen] = useState(false)
  const gearStore = useGearStore()
  const allGearItems = useSelector(gearStore, selectAllGear)

  const allowedTypes = sectionGearTypes[section]
  const isSearching = searchTerms.length > 0

  const sectionItems = getSectionItems(isSearching, searchTerms, allowedTypes, allGearItems, gearStore)

  if (isSearching && sectionItems.length === 0) return null

  const rootItems = sectionItems.filter((item) => !item.parentId)
  const getChildItems = createGetChildItems(sectionItems)

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
          <Typography>{section}</Typography>
          {section === GearSection.Cyberware && <CyberwareSectionHeader />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 1 }}>
        <GearViewSectionContent
          section={section}
          rootItems={rootItems}
          getChildItems={getChildItems}
        />
      </AccordionDetails>
    </Accordion>
  )
}
