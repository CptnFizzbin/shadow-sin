import Box from "@mui/material/Box"
import { FC } from "react"

import { formatNuyen } from "../System/Nuyen"
import { Stat, StatBlock } from "../UI/StatBlock"
import { formatAvail } from "./Availability"
import { GearData } from "./GearData"

interface GearAvailCostProps {
  item: GearData
}

export const GearAvailCost: FC<GearAvailCostProps> = ({ item }) => {
  if (!item.avail && !item.cost) return null

  return (
    <Box>
      <StatBlock>
        {item.avail && <Stat name="Avail" value={formatAvail(item.avail)} />}
        {item.cost && <Stat name="Cost" value={formatNuyen(item.cost)} />}
      </StatBlock>
    </Box>
  )
}
