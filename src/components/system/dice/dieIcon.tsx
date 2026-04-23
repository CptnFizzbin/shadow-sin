import { useTheme } from "@mui/material"
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
