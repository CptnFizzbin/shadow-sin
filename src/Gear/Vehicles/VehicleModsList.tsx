import { Box, Stack, Typography } from "@mui/material"
import { FC } from "react"

import { getAttr } from "../GearData"
import { VehicleModAttr, VehicleModData } from "./VehicleModData"

interface VehicleModsListProps {
  title: string
  maxSlots: number
  mods: VehicleModData[]
}

export const VehicleModsList: FC<VehicleModsListProps> = ({
  title,
  maxSlots,
  mods,
}) => {
  const slotsUsed = mods
    .map((mod) => getAttr<number>(mod, VehicleModAttr.slotCost) || 0)
    .reduce((sum, cost) => sum + cost, 0)

  return (
    <Stack gap={1}>
      <Typography>
        {title} ({slotsUsed}/{maxSlots})
      </Typography>
      {mods.map((mod) => (
        <Box key={mod.id}>{mod.name}</Box>
      ))}
    </Stack>
  )
}
