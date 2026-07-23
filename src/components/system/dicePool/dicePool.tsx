import Box from "@mui/material/Box"
import type { FC } from "react"

import { usePrototypeVersion } from "#/components/ui/prototype/prototype.tsx"

import type { DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"
import { DiceGroupDisplay } from "./diceGroupDisplay.tsx"
import { getPoolSize } from "./dicePoolData.tsx"
import { DicePoolVariantA } from "./prototype/dicePoolVariantA.tsx"
import { DicePoolVariantB } from "./prototype/dicePoolVariantB.tsx"
import { DicePoolVariantC } from "./prototype/dicePoolVariantC.tsx"
import { DicePoolVariantD } from "./prototype/dicePoolVariantD.tsx"
import { DicePoolVariantE } from "./prototype/dicePoolVariantE.tsx"

interface DicePoolProps {
  name: string
  groups: DiceGroupList
}

// THROWAWAY prototype hook — see prototype/NOTES.md. Lets every real DicePool
// usage in the app preview the 5 redesigns via the app-root <Prototype>
// switcher without touching each call site. Falls through to today's design
// with no ancestor <Prototype> (e.g. every existing test), so this is safe to
// leave in place until a design is picked. Delete this block, the variant
// imports, and the prototype/ folder once one is chosen or rejected.
export const DicePool: FC<DicePoolProps> = ({ name, groups }) => {
  const prototypeVersion = usePrototypeVersion()

  switch (prototypeVersion) {
    case "A": return <DicePoolVariantA name={name} groups={groups} />
    case "B": return <DicePoolVariantB name={name} groups={groups} />
    case "C": return <DicePoolVariantC name={name} groups={groups} />
    case "D": return <DicePoolVariantD name={name} groups={groups} />
    case "E": return <DicePoolVariantE name={name} groups={groups} />
    case null:
    default:
      break
  }

  const diceGroups = groups.flat().filter(isDiceGroup)

  const total = getPoolSize(diceGroups)

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <DiceGroupDisplay name={name} size={total} total />

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
