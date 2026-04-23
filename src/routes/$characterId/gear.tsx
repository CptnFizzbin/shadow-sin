import { Divider } from "@mui/material"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { RiSearchLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { NuyenSection } from "#/components/character/finances/nuyen/nuyenSection.tsx"
import { GearSection } from "#/components/character/gearPage/gearSectionTypes.ts"
import { GearViewSection } from "#/components/character/gearPage/gearViewSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/gear")({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const searchTerms = searchQuery.trim() ? searchQuery.trim().split(/\s+/) : []

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
    </Stack>
  )
}
