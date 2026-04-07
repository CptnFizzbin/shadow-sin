import InputAdornment from "@mui/material/InputAdornment"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { RiSearchLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearSection, GearViewSection } from "#/components/character/gearPage/gearViewSection.tsx"
import { QuickNuyenSection } from "#/components/finances/nuyen/quickNuyenSection.tsx"

export const GearViewPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const searchTerms = searchQuery.trim() ? searchQuery.trim().split(/\s+/) : []

  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <QuickNuyenSection />
      </Paper>

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
