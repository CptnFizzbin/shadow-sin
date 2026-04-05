import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useEssenseInfo } from "#/components/character/characterUtils.ts"
import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { BASE_ESSENCE } from "#/components/gear/implantUtils.ts"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { isLicenseData } from "#/lib/system/gear/licenseData.ts"
import { isSinData } from "#/lib/system/gear/sinData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export enum GearSection {
  Cyberware = "Cyberware",
  Weapons = "Weapons",
  Armor = "Armor",
  Vehicles = "Vehicles",
  Devices = "Devices",
  Licenses = "SINs & Licenses",
  Misc = "Misc",
}

export const sectionGearTypes: Record<GearSection, GearType[]> = {
  [GearSection.Cyberware]: [GearType.implant],
  [GearSection.Weapons]: [GearType.weapon, GearType.firearm, GearType.firearmAccessory],
  [GearSection.Armor]: [GearType.armor],
  [GearSection.Vehicles]: [GearType.vehicle],
  [GearSection.Devices]: [GearType.device, GearType.software],
  [GearSection.Licenses]: [GearType.sin, GearType.license],
  [GearSection.Misc]: [GearType.other],
}

interface GearViewSectionProps {
  section: GearSection
  searchTerms: string[]
}

const CyberwareSectionHeader: FC = () => {
  const essenceInfo = useEssenseInfo()
  const isEssenceError = essenceInfo.essenseRemaining <= 0

  return (
    <Typography
      variant="body2"
      color={isEssenceError ? "error" : "text.secondary"}
    >
      {essenceInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")} / {BASE_ESSENCE} Ess
    </Typography>
  )
}

export const GearViewSection: FC<GearViewSectionProps> = ({ section, searchTerms }) => {
  const [isManuallyOpen, setIsManuallyOpen] = useState(false)
  const gearStore = useGearStore()
  const allGearItems = useStore(gearStore, (gear) => gear)

  const allowedTypes = sectionGearTypes[section]
  const isSearching = searchTerms.length > 0

  const sectionItems = isSearching
    ? gearStore.search(searchTerms).filter((item) => allowedTypes.includes(item.itemType as GearType))
    : Object.values(allGearItems).filter((item) => allowedTypes.includes(item.itemType as GearType))

  if (isSearching && sectionItems.length === 0) return null

  const rootItems = sectionItems.filter((item) => !item.parentId)
  const getChildItems = (parentId: string) =>
    sectionItems.filter((item) => item.parentId === parentId)

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
          justifyContent="space-between"
          sx={{
            flexGrow: 1,
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
        <Stack gap={1}>
          {section === GearSection.Licenses
            ? rootItems.filter(isSinData).map((sin) => (
                <GearViewItem key={sin.id} item={sin} subItems={getChildItems(sin.id).filter(isLicenseData)} />
              ))
            : rootItems.map((item) => (
                <GearViewItem key={item.id} item={item} subItems={getChildItems(item.id)} />
              ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
