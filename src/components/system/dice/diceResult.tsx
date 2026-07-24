import Stack from "@mui/material/Stack"
import type { FC } from "react"

import {
  selectAllDice,
  selectAllSettled,
  selectIsGlitch,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import type { DiceRoller } from "#/system/dice/diceRoller.ts"

import { getDiceOffset } from "./diceUtils.ts"
import { DieFace } from "./dieFace.tsx"

interface DiceResultProps {
  roller: DiceRoller
  highlightHits?: boolean
  highlightGlitches?: boolean
  iconSize?: number
  /** Optional inclusive start index into the roller's dice array. */
  startIndex?: number
  /** Optional exclusive end index into the roller's dice array. */
  endIndex?: number
}

export const DiceResult: FC<DiceResultProps> = ({
  roller,
  highlightHits = true,
  highlightGlitches = true,
  iconSize = 18,
  startIndex,
  endIndex,
}) => {
  const allDice = useDiceRollerSelector(roller, selectAllDice)
  const isGlitch = useDiceRollerSelector(roller, selectIsGlitch)
  const allSettled = useDiceRollerSelector(roller, selectAllSettled)
  const dice = (startIndex !== undefined || endIndex !== undefined)
    ? allDice.slice(startIndex ?? 0, endIndex)
    : allDice

  const diceDefaultColor = (allSettled && isGlitch && highlightGlitches) ? "error.main" : "secondary.main"

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
          highlightHit={highlightHits && !die.isRolling}
          highlightGlitch={highlightGlitches && !die.isRolling}
          style={getDiceOffset(die.isRolling)}
          size={iconSize}
        />
      ))}
    </Stack>
  )
}
