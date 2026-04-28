import Box from "@mui/material/Box"
import type { FC } from "react"

import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { DiceGroupDisplay } from "#/components/system/dicePool/diceGroupDisplay.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"

interface DicePoolProps {
  name: string
  groups: DiceGroupList
  onRoll?: (count: number) => void
}

export const DicePool: FC<DicePoolProps> = ({ name, groups, onRoll }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)

  const total = getPoolSize(diceGroups)

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <DiceGroupDisplay
        name={name}
        size={total}
        total
        onClick={onRoll ? () => onRoll(total) : undefined}
      />

      {diceGroups.map((group) => (
        <DiceGroupDisplay
          key={`${name}-${group.id ?? group.name}`}
          name={group.name}
          size={group.size}
          color={group.color}
        />
      ))}
    </Box>
  )
}
