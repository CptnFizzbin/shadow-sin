import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { getDiceOffset } from "#/components/system/dice/diceUtils.ts"
import { DieFace } from "#/components/system/dice/dieFace.tsx"
import { selectAllDice, selectIsGlitch, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"
import type { DiceRoller } from "#/system/dice/diceRoller.ts"

interface DiceResultProps {
  roller: DiceRoller
  highlightHits?: boolean
  highlightGlitches?: boolean
  iconSize?: number
}

export const DiceResult: FC<DiceResultProps> = ({
  roller,
  highlightHits = true,
  highlightGlitches = true,
  iconSize = 18,
}) => {
  const dice = useDiceRollerSelector(roller, selectAllDice)
  const isGlitch = useDiceRollerSelector(roller, selectIsGlitch)

  const diceDefaultColor = (isGlitch && highlightGlitches) ? "error.main" : "secondary.main"

  return (
    <Stack
      direction="row"
      sx={{
        flexWrap: "wrap",
        gap: 0,
        color: diceDefaultColor,
        margin: "auto",
        justifyContent: "center",
      }}
    >
      {dice.map((die, index) => (
        <DieFace
          key={index}
          value={die.value}
          highlightHit={highlightHits}
          highlightGlitch={highlightGlitches}
          style={getDiceOffset(die.isRolling)}
          size={iconSize}
        />
      ))}
    </Stack>
  )
}
