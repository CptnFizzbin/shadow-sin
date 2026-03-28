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
import type { CSSProperties, FC } from "react"
import { useEffect, useState } from "react"

import type { DiceResultsInfo } from "#/components/Dice/DiceResultsInfo.tsx"
import { rollD6 } from "#/components/Dice/UseDiceRoller.ts"

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
    if (!results.isRolling) return
    const handle = setInterval(() => {
      setDiceValues(results.values.map(() => rollD6()))
    }, 100)

    return () => clearInterval(handle)
  }, [results])

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={0.5}
      sx={{ color: diceDefaultColor }}
    >
      {diceValues.map((value, index) => {
        // eslint-disable-next-line react-hooks/purity
        const rotate = results.isRolling ? Math.random() * 360 : 0

        return (
          <DieIcon
            key={index}
            value={value}
            highlightHit={highlightHits}
            highlightGlitch={highlightGlitches}
            style={{ rotate: `${rotate}deg` }}
          />
        )
      })}
    </Stack>
  )
}

interface DieIconProps {
  value: number // 1-6 or 0 for unrolled
  highlightHit?: boolean
  highlightGlitch?: boolean
  style?: CSSProperties
}

export const DieIcon: FC<DieIconProps> = ({
  value,
  highlightHit = true,
  highlightGlitch = true,
  style,
}) => {
  const theme = useTheme()
  const glitchColor = theme.palette.error.main
  const hitColor = theme.palette.success.main

  switch (value) {
    case 1:
      return highlightGlitch ? <RiDice1Fill color={glitchColor} style={style} /> : <RiDice1Line style={style} />
    case 2:
      return <RiDice2Line style={style} />
    case 3:
      return <RiDice3Line style={style} />
    case 4:
      return <RiDice4Line style={style} />
    case 5:
      return highlightHit ? <RiDice5Fill color={hitColor} style={style} /> : <RiDice5Line style={style} />
    case 6:
      return highlightHit ? <RiDice6Fill color={hitColor} style={style} /> : <RiDice6Line style={style} />
    default:
      return <RiDiceLine style={style} />
  }
}
