import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"

interface VehicleStatGroupsProps {
  vehicle: VehicleData
}

/** Movement (Handling/Accel/Speed) and Systems (Pilot/Body/Armor/Sensor) stat groups. */
export const VehicleStatGroups: FC<VehicleStatGroupsProps> = ({ vehicle }) => (
  <Stack sx={{ gap: 1, width: "100%" }}>
    <Stack sx={{ gap: 0.25 }}>
      <Label label="Movement" textAlign="left" sx={{ fontSize: "0.7rem" }} />
      <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: "0.8rem" }}>Handling {vehicle.handling}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Accel {vehicle.accel}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Speed {vehicle.speed}</Typography>
      </Stack>
    </Stack>

    <Stack sx={{ gap: 0.25 }}>
      <Label label="Systems" textAlign="left" sx={{ fontSize: "0.7rem" }} />
      <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: "0.8rem" }}>Pilot {vehicle.pilot}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Body {vehicle.body}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Armor {vehicle.armor}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Sensor {vehicle.sensor}</Typography>
      </Stack>
    </Stack>
  </Stack>
)
