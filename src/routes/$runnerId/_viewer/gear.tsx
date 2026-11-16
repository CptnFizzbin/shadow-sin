import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import InputAdornment from "@mui/material/InputAdornment"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiSearchLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { useAddItemDialogContext } from "#/components/entities/items/addItemDialogContext.ts"
import type { GearListFilter } from "#/components/entities/items/viewer/gearListFilter.ts"
import { GearListFilterContext } from "#/components/entities/items/viewer/gearListFilter.ts"
import { GearSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import { GearViewSection } from "#/components/entities/items/viewer/gearViewSection.tsx"
import { NuyenSection } from "#/components/runner/sections/finances/viewer/nuyen/nuyenSection.tsx"
import { useAvailabilityTestDialog } from "#/components/system/availabilityTest/availabilityTestDialog.tsx"
import { useLicenseCheckDialog } from "#/components/system/licenseCheck/licenseCheckDialog.tsx"
import { AlertsList } from "#/components/ui/alerts/alertsList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useEditorMode } from "#/contexts/builder/editorMode.tsx"
import { searchGear } from "#/hooks/items/gearHooks.ts"
import { useFociAlerts } from "#/hooks/items/types/magical/useFociAlerts.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { isItemStashed } from "#/system/formulas/items/itemStateRules.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

type GearTabValue = "available" | "stashed"

export const Route = createFileRoute("/$runnerId/_viewer/gear")({
  component: RouteComponent,
})

const isOnTab = (item: ItemData, tab: GearTabValue) => (tab === "stashed") === isItemStashed(item)

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<GearTabValue>("available")
  const [searchQuery, setSearchQuery] = useState("")
  const searchTerms = searchQuery.trim() ? searchQuery.trim().split(/\s+/) : []
  const isSearching = searchTerms.length > 0
  const isBuilder = !useEditorMode().isViewer
  const licenseCheckDialog = useLicenseCheckDialog()
  const availabilityTestDialog = useAvailabilityTestDialog()
  const addItemDialog = useAddItemDialogContext()
  const allGear = useRunnerSelector(ItemSelectors.selectAll)
  const fociAlerts = useFociAlerts()

  const matchingIds = new Set(searchGear(allGear, searchTerms).map((item) => item.id))
  const filter: GearListFilter = {
    includes: (item) => isOnTab(item, activeTab) && matchingIds.has(item.id),
  }

  const topLevelItems = Object.values(allGear).filter((item) => !item.items.parentId)
  const countOnTab = (tab: GearTabValue) => topLevelItems.filter((item) => isOnTab(item, tab)).length
  const hasVisibleItems = topLevelItems.some(filter.includes)

  return (
    <Stack>
      <SectionHeader>Gear</SectionHeader>

      <AlertsList alerts={fociAlerts} />

      <NuyenSection />

      <Divider />

      <Paper sx={{ margin: -1, marginBottom: 0 }} variant="elevation">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as GearTabValue)} variant="fullWidth">
          <Tab value="available" label={`Available (${countOnTab("available")})`} />
          <Tab value="stashed" label={`Stashed (${countOnTab("stashed")})`} />
        </Tabs>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "center" } }}>
        <TextField
          size="small"
          placeholder="Search gear…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
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

        <ButtonGroup size="small" color="secondary" sx={{ "& > .MuiButton-root": { flexGrow: 1 } }}>
          <Button startIcon={<RiAddLine size={14} />} onClick={() => addItemDialog.open()}>
            Add Item
          </Button>
          {!isBuilder && (
            <Button onClick={() => availabilityTestDialog.open()}>Availability Test</Button>
          )}
          {!isBuilder && (
            <Button onClick={() => licenseCheckDialog.open()}>License Check</Button>
          )}
        </ButtonGroup>
      </Stack>

      <GearListFilterContext.Provider value={filter}>
        {Object.values(GearSection).map((section) => (
          <GearViewSection key={section} section={section} forceExpanded={isSearching} />
        ))}
      </GearListFilterContext.Provider>

      {!hasVisibleItems && (
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", paddingY: 2 }}>
          {isSearching
            ? "No gear matches your search."
            : (activeTab === "stashed" ? "Nothing is stashed." : "No gear on hand.")}
        </Typography>
      )}

      {availabilityTestDialog.outlet}
      {licenseCheckDialog.outlet}
    </Stack>
  )
}
