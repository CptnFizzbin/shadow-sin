import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useEffect, useState } from "react"

import type { DiceResultsInfo } from "#/components/Dice/DiceResultsInfo.tsx"
import { getDiceOffset, rollD6 } from "#/components/Dice/DiceUtils.ts"
import { DieIcon } from "#/components/Dice/DieIcon.tsx"

interface DiceResultProps {
  results: DiceResultsInfo
  highlightHits?: boolean
  highlightGlitches?: boolean
}

export const DiceResult: FC<DiceResultProps> = ({
  results,
  highlightHits = true,
  highlightGlitches = true,
}) => {
  const diceDefaultColor = (results.isGlitch === "crtical" && highlightGlitches) ? "error.main" : "secondary.main"
  const [diceValues, setDiceValues] = useState<number[]>(results.values)

  useEffect(() => {
    if (!results.isRolling) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiceValues(results.values)
    } else {
      const handle = setInterval(() => {
        setDiceValues(results.values.map(() => rollD6()))
      }, 100)

      return () => clearInterval(handle)
    }
  }, [results])

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      sx={{ color: diceDefaultColor }}
    >
      {diceValues.map((value, index) => {
        return (
          <DieIcon
            key={index}
            value={value}
            highlightHit={highlightHits}
            highlightGlitch={highlightGlitches}
            style={getDiceOffset(results.isRolling)}
          />
        )
      })}
    </Stack>
  )
}
