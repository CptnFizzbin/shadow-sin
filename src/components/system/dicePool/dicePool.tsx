import Box from "@mui/material/Box"
import type { FC } from "react"
import { useContext } from "react"

import { DiceTrayContext } from "#/components/dice/diceTrayContext.ts"

import type { DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"
import { DiceGroupDisplay } from "./diceGroupDisplay.tsx"
import { getPoolSize } from "./dicePoolData.tsx"

interface DicePoolProps {
  name: string
  groups: DiceGroupList
}

export const DicePool: FC<DicePoolProps> = ({ name, groups }) => {
  const diceTray = useContext(DiceTrayContext)
  const diceGroups = groups.flat().filter(isDiceGroup)

  const total = getPoolSize(diceGroups)

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <DiceGroupDisplay
        name={name}
        size={total}
        total
        onClick={diceTray ? () => diceTray.setDice(total) : undefined}
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
