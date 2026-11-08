import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { DiceRoller } from "#/services/dice/diceRoller.ts"
import {
  selectAllDice,
  selectAllSettled,
  selectIsGlitch,
  useDiceRollerSelector,
} from "#/services/dice/state/diceRoller.selector.ts"

import { getDiceOffset } from "./diceUtils.ts"
import { DieFace } from "./dieFace.tsx"

/** The most dice a single row of a {@link DiceResult} holds before wrapping onto the next row. */
export const MAX_DICE_PER_ROW = 10

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
        // Capping the width rather than chunking dice into rows lets a narrow parent wrap to fewer dice per row,
        // so side-by-side pools shrink instead of overflowing into each other.
        maxWidth: iconSize * MAX_DICE_PER_ROW,
        minWidth: 0,
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
