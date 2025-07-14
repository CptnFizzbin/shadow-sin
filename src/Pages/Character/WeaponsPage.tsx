import { Stack, Typography } from "@mui/material"
import { FC } from "react"

import { useGearOfType } from "../../Gear/GearContext"
import { GearType } from "../../Gear/GearData"
import { GearList } from "../../Gear/GearList"
import { WeaponData } from "../../Gear/Weapons/WeaponData"

export const WeaponsPage: FC = () => {
  const weapons = useGearOfType<WeaponData>(GearType.weapon).filter(
    (gear) => !gear.attachedTo,
  )

  return (
    <Stack gap={1}>
      <Typography variant={"h4"}>Weapons</Typography>
      <GearList gear={weapons} />
    </Stack>
  )
}
