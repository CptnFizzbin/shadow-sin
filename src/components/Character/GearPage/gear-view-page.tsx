import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiSearchLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { GearViewItem } from "#/components/Character/GearPage/gear-view-item.tsx"
import { useEssenseInfo } from "#/components/Character/character-utils.ts"
import { BASE_ESSENCE } from "#/components/Gear/implant-utils.ts"
import { useGearApi } from "#/components/Gear/use-gear-api.ts"
import { useLifestyleStore } from "#/components/Profile/use-lifestyle-store.ts"
import { isLicenseData } from "#/lib/system/gear/license-data.ts"
import { isSinData } from "#/lib/system/gear/sin-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"
import type { ItemData } from "#/lib/system/item-data.ts"
import { Lifestyles } from "#/lib/system/lifestyle-type.ts"

enum GearSection {
  Cyberware = "Cyberware",
  Weapons = "Weapons",
  Armor = "Armor",
  Vehicles = "Vehicles",
  Devices = "Devices",
  Licenses = "SINs & Licenses",
  Misc = "Misc",
  Lifestyle = "Lifestyle",
}

const sectionGearTypes: Partial<Record<GearSection, GearType[]>> = {
  [GearSection.Cyberware]: [GearType.implant],
  [GearSection.Weapons]: [GearType.weapon, GearType.firearm, GearType.firearmAccessory],
  [GearSection.Armor]: [GearType.armor],
  [GearSection.Vehicles]: [GearType.vehicle],
  [GearSection.Devices]: [GearType.device, GearType.software],
  [GearSection.Licenses]: [GearType.sin, GearType.license],
  [GearSection.Misc]: [GearType.other],
}

function matchesSearch(item: ItemData, query: string): boolean {
  if (!query) return true
  const lowerQuery = query.toLowerCase()
  return item.name.toLowerCase().includes(lowerQuery)
    || (item.description?.toLowerCase().includes(lowerQuery) ?? false)
}

interface GearViewSectionProps {
  section: GearSection
  allGearItems: Record<string, ItemData>
  searchQuery: string
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

const LifestyleSectionContent: FC = () => {
  const lifestyleStore = useLifestyleStore()
  const quality = useStore(lifestyleStore, (lifestyle) => lifestyle.quality)
  const monthsPaid = useStore(lifestyleStore, (lifestyle) => lifestyle.monthsPaid)
  const upkeep = Lifestyles[quality].upkeep

  return (
    <Stack gap={0.5} sx={{ p: 0.5 }}>
      <Typography variant="body2">{quality}</Typography>
      <Typography variant="caption" color="text.secondary">
        {monthsPaid} month{monthsPaid !== 1 ? "s" : ""} prepaid
        {upkeep > 0 && ` · ${upkeep.toLocaleString("en")}¥/month`}
      </Typography>
    </Stack>
  )
}

const GearViewSection: FC<GearViewSectionProps> = ({
  section,
  allGearItems,
  searchQuery,
}) => {
  const allowedTypes = sectionGearTypes[section]

  const sectionItems = useMemo(() => {
    if (!allowedTypes) return []
    const allSectionItems = Object.values(allGearItems).filter(
      (item) => allowedTypes.includes(item.itemType as GearType),
    )
    if (!searchQuery) return allSectionItems

    // Collect IDs of directly matching items plus their parents so that
    // searching for a sub-item (e.g. "Smartlink") shows the parent too.
    const includedIds = new Set<string>()
    for (const item of allSectionItems) {
      if (matchesSearch(item, searchQuery)) {
        includedIds.add(item.id)
        if (item.parentId) includedIds.add(item.parentId)
      }
    }
    return allSectionItems.filter((item) => includedIds.has(item.id))
  }, [allGearItems, allowedTypes, searchQuery])

  const hasLifestyleMatch = section === GearSection.Lifestyle
    && (!searchQuery || "lifestyle".includes(searchQuery.toLowerCase()))

  const hasItems = sectionItems.length > 0 || hasLifestyleMatch

  if (!hasItems) return null

  const rootItems = sectionItems.filter((item) => !item.parentId)
  const getChildItems = (parentId: string) => {
    const children = sectionItems.filter((item) => item.parentId === parentId)
    if (!searchQuery) return children
    // Only show children that directly match when the parent was pulled in by a child match
    return children.filter((item) => matchesSearch(item, searchQuery))
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      defaultExpanded
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
        {section === GearSection.Lifestyle
          ? (
              <LifestyleSectionContent />
            )
          : (
              <Stack gap={1}>
                {section === GearSection.Licenses
                  ? rootItems.filter(isSinData).map((sin) => {
                      const licenses = getChildItems(sin.id).filter(isLicenseData)
                      return (
                        <GearViewItem key={sin.id} item={sin} subItems={licenses} />
                      )
                    })
                  : rootItems.map((item) => {
                      const childItems = getChildItems(item.id)
                      return (
                        <GearViewItem key={item.id} item={item} subItems={childItems} />
                      )
                    })}
              </Stack>
            )}
      </AccordionDetails>
    </Accordion>
  )
}

export const GearViewPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const gearApi = useGearApi()
  const allGearItems = useStore(gearApi, (gear) => gear)

  return (
    <Stack gap={1}>
      <TextField
        size="small"
        placeholder="Search gear…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine size={16} />
              </InputAdornment>
            ),
          },
        }}
      />

      {Object.values(GearSection).map((section) => (
        <GearViewSection
          key={section}
          section={section}
          allGearItems={allGearItems}
          searchQuery={searchQuery}
        />
      ))}
    </Stack>
  )
}
