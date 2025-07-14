import { Stack, Typography } from "@mui/material"
import React, { FC } from "react"

import { AugmentData } from "../../Gear/Augments/AugmentData"
import { useGearOfType } from "../../Gear/GearContext"
import { GearType } from "../../Gear/GearData"
import { GearList } from "../../Gear/GearList"

export const AugmentsPage: FC = () => {
  const augments = useGearOfType<AugmentData>(GearType.augment).filter(
    (gear) => !gear.attachedTo,
  )

  return (
    <Stack gap={1}>
      <Typography variant={"h4"}>Augments</Typography>
      <GearList gear={augments} />
    </Stack>
  )
}
