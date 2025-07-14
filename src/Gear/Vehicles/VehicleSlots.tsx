import { Divider, Stack, Typography } from "@mui/material"
import { FC } from "react"

import { RecordId } from "../../Api/Model"
import { Slot } from "../../UI/Slot"

interface SlottedItem {
  id: RecordId
  name: string
  size: number
}

interface VehicleModSlotsProps {
  name: string
  slots: number
  items: SlottedItem[]
}

export const VehicleSlots: FC<VehicleModSlotsProps> = ({
  name,
  slots,
  items,
}) => {
  const usedSlots = items.reduce((sum, item) => sum + item.size, 0)

  return (
    <Stack gap={1}>
      <Typography>
        {name} ({usedSlots}/{slots})
      </Typography>
      <Divider />
      {items.map((item) => (
        <Slot key={item.id} name={item.name} size={item.size} />
      ))}
    </Stack>
  )
}
