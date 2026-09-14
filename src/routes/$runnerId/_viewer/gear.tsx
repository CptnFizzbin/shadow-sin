import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { RiAddLine, RiSearchLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { NuyenSection } from "#/components/finances/viewer/nuyen/nuyenSection.tsx"
import { useAddItemDialogContext } from "#/components/items/addItemDialogContext.ts"
import { GearSection } from "#/components/items/viewer/gearSectionTypes.ts"
import { GearViewSection } from "#/components/items/viewer/gearViewSection.tsx"
import { useLicenseCheckDialog } from "#/components/licenseCheck/licenseCheckDialog.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useIsBuilder } from "#/contexts/builder/builderStore.context.ts"

export const Route = createFileRoute("/$runnerId/_viewer/gear")({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const searchTerms = searchQuery.trim() ? searchQuery.trim().split(/\s+/) : []
  const isBuilder = useIsBuilder()
  const licenseCheckDialog = useLicenseCheckDialog()
  const addItemDialog = useAddItemDialogContext()

  return (
    <Stack>
      <SectionHeader>Gear</SectionHeader>

      <NuyenSection />

      <Divider />

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

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => addItemDialog.open()}
        color="secondary"
        fullWidth
      >
        Add Item
      </Button>

      {Object.values(GearSection).map((section) => (
        <GearViewSection key={section} section={section} searchTerms={searchTerms} />
      ))}

      {!isBuilder && (
        <>
          <Divider />
          <Button size="small" variant="outlined" onClick={() => licenseCheckDialog.open()}>
            License Check
          </Button>
          {licenseCheckDialog.outlet}
        </>
      )}
    </Stack>
  )
}
