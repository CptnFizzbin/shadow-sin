import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"
import { useState } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"

import { DeviceLoadedProgramsList } from "./deviceLoadedProgramsList.tsx"
import { DeviceRunningProgramsList } from "./deviceRunningProgramsList.tsx"

type ProgramsTab = "loaded" | "running"

export interface DeviceProgramsSectionProps {
  device: DeviceData
  /** The Programs and Agents loaded on `device`. */
  programs: ProgramData[]
  onOpenProgram?: (item: ItemData) => void
}

/** A device's Loaded and Running Programs — side by side on medium and wider viewports, tabbed on narrow ones. */
export const DeviceProgramsSection: FC<DeviceProgramsSectionProps> = ({ device, programs, onOpenProgram }) => {
  const theme = useTheme()
  const isWideViewport = useMediaQuery(theme.breakpoints.up("md"))
  const [activeTab, setActiveTab] = useState<ProgramsTab>("loaded")

  const loadedList = <DeviceLoadedProgramsList device={device} programs={programs} onOpenProgram={onOpenProgram} />
  const runningList = <DeviceRunningProgramsList programs={programs} onOpenProgram={onOpenProgram} />

  if (isWideViewport) {
    return (
      <Grid container spacing={2}>
        <Grid size={6}>
          <Stack>
            <Label>Loaded</Label>
            {loadedList}
          </Stack>
        </Grid>
        <Grid size={6}>
          <Stack>
            <Label>Running</Label>
            {runningList}
          </Stack>
        </Grid>
      </Grid>
    )
  }

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider" }}>
      <Tabs value={activeTab} onChange={(_, tab: ProgramsTab) => setActiveTab(tab)} variant="fullWidth">
        <Tab value="loaded" label="Loaded" />
        <Tab value="running" label="Running" />
      </Tabs>
      <Box sx={{ padding: 1 }}>
        {activeTab === "loaded" ? loadedList : runningList}
      </Box>
    </Box>
  )
}
