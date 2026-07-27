import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { RiSearchLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { NuyenSection } from "#/components/runner/finances/nuyen/nuyenSection.tsx"
import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import { GearViewSection } from "#/components/runner/gearPage/gearViewSection.tsx"
import { useLicenseCheckDialog } from "#/components/runner/licenseCheck/licenseCheckDialog.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useIsBuilder } from "#/lib/contexts/builder/builderStore.context.ts"

export const Route = createFileRoute("/$runnerId/gear")({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const searchTerms = searchQuery.trim() ? searchQuery.trim().split(/\s+/) : []
  const isBuilder = useIsBuilder()
  const licenseCheckDialog = useLicenseCheckDialog()

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

      {Object.values(GearSection).map((section) => (
        <GearViewSection key={section} section={section} searchTerms={searchTerms} />
      ))}

      {!isBuilder && (
        <>
          <Divider />
          <Button size="small" variant="outlined" onClick={() => licenseCheckDialog.open()}>
            License Check
          </Button>
          {licenseCheckDialog.dialog}
        </>
      )}
    </Stack>
  )
}
