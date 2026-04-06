import Box from "@mui/material/Box"
import type { FC } from "react"

import type { DiceGroupList } from "#/components/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/dicePool/diceGroup.tsx"
import { DiceGroupDisplay } from "#/components/dicePool/diceGroupDisplay.tsx"
import { getPoolSize } from "#/components/dicePool/dicePoolData.tsx"

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
