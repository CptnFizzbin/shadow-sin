import Box from "@mui/material/Box"
import type { FC } from "react"

import { DiceGroupDisplay } from "#/components/DicePool/dice-group-display.tsx"
import type { DiceGroupList } from "#/components/DicePool/dice-group.tsx"
import { isDiceGroup } from "#/components/DicePool/dice-group.tsx"
import { getPoolSize } from "#/components/DicePool/dice-pool-data.tsx"

interface DicePoolProps {
  name: string
  groups: DiceGroupList
}

export const DicePool: FC<DicePoolProps> = ({ name, groups }) => {
  const diceGroups = groups.filter(isDiceGroup)

  const total = getPoolSize(diceGroups)

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <DiceGroupDisplay name={name} size={total} total />

      {diceGroups.map((group) => (
        <DiceGroupDisplay
          key={`${name}-${group.name}`}
          name={group.name}
          size={group.size}
          color={group.color}
        />
      ))}
    </Box>
  )
}
