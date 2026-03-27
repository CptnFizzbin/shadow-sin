import { useTheme } from "@mui/material"
import Stack from "@mui/material/Stack"
import {
  RiDice1Fill,
  RiDice1Line,
  RiDice2Line,
  RiDice3Line,
  RiDice4Line,
  RiDice5Fill,
  RiDice5Line,
  RiDice6Fill,
  RiDice6Line,
  RiDiceLine,
} from "@remixicon/react"
import type { FC } from "react"

export interface DiceResults {
  values: number[] // 1-6 or 0 for unrolled
  hits?: number
  isGlitch?: boolean | "crtical"
}

interface DiceResultProps {
  results: DiceResults
  highlightHits?: boolean
  highlightGlitches?: boolean
}

export const DiceResult: FC<DiceResultProps> = ({
  results,
  highlightHits = true,
  highlightGlitches = true,
}) => {
  const diceDefaultColor = (results.isGlitch === "crtical" && highlightGlitches) ? "error.main" : "secondary.main"

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={0.5}
      sx={{ color: diceDefaultColor }}
    >
      {results.values.map((value, index) => (
        <DieIcon
          key={index}
          value={value}
          highlightHit={highlightHits}
          highlightGlitch={highlightGlitches}
        />
      ))}
    </Stack>
  )
}

interface DieIconProps {
  value: number // 1-6 or 0 for unrolled
  highlightHit?: boolean
  highlightGlitch?: boolean
}

export const DieIcon: FC<DieIconProps> = ({
  value,
  highlightHit = true,
  highlightGlitch = true,
}) => {
  const theme = useTheme()
  const glitchColor = theme.palette.error.main
  const hitColor = theme.palette.success.main

  switch (value) {
    case 1:
      return highlightGlitch ? <RiDice1Fill color={glitchColor} /> : <RiDice1Line />
    case 2:
      return <RiDice2Line />
    case 3:
      return <RiDice3Line />
    case 4:
      return <RiDice4Line />
    case 5:
      return highlightHit ? <RiDice5Fill color={hitColor} /> : <RiDice5Line />
    case 6:
      return highlightHit ? <RiDice6Fill color={hitColor} /> : <RiDice6Line />
    default:
      return <RiDiceLine />
  }
}
