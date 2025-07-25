import { Chip, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { FC } from "react"

import { useAttachedGear, useFilterGear } from "../GearContext"
import { GearType } from "../GearData"
import { GearInfoProps } from "../GearInfo"
import { GearInfoBlock } from "../GearInfoBlock"
import { AutosoftData } from "../Software/Autosoft/AutosoftData"
import { VehicleData } from "../Vehicles/VehicleData"
import { RccAttr } from "./RccAttr"
import { RccData } from "./RccData"

export const RccInfo: FC<GearInfoProps<RccData>> = ({ item: rcc }) => {
  const dataProcessing = rcc.attributes[RccAttr.dataProcessing]
  const autosofts = useAttachedGear(rcc.id)
    .filter((gear) => gear.gearType === GearType.autosoft)
    .map((gear) => gear as AutosoftData)
  const slavedAutosofts = autosofts.filter((autosoft) =>
    rcc.slavedAutosofts.includes(autosoft.id),
  )

  const slavedVehicles: VehicleData[] = useFilterGear(
    (gear) => gear.slavedTo === rcc.id,
  )
  const maxSlaved = rcc.attributes[RccAttr.deviceRating] * 3

  return (
    <GearInfoBlock item={rcc}>
      <Box>
        <Typography variant={"h6"}>
          Autosofts ({rcc.slavedAutosofts.length}/{dataProcessing} shared)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {slavedAutosofts.map((autosoft) => (
            <Chip key={autosoft.id} label={autosoft.name} />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant={"h6"}>
          Slaved ({slavedVehicles.length} / {maxSlaved})
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {slavedVehicles.map((vehicle) => (
            <Chip key={vehicle.id} label={vehicle.name} />
          ))}
        </Box>
      </Box>
    </GearInfoBlock>
  )
}
