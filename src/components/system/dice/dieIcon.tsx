import type { RemixiconComponentType } from "@remixicon/react"
import {
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

const glitchColor = "var(--mui-palette-error-main)"
const hitColor = "var(--mui-palette-success-main)"

interface DieIconProps {
  value: number | null // 1-6 or null for unrolled
  highlightHit?: boolean
  highlightGlitch?: boolean
  style?: CSSProperties
  size?: number
}

export const DieIcon: FC<DieIconProps> = ({
  value,
  highlightHit = true,
  highlightGlitch = true,
  style,
  size,
}) => {
  type IconProps = {
    color?: string
    size?: number
    style?: CSSProperties
  }

  let Icon: RemixiconComponentType
  const iconProps: IconProps = {
    color: undefined,
    size: size,
    style: style,
  }

  switch (value) {
    case 1:
      Icon = RiDice1Line
      if (highlightGlitch) {
        iconProps.color = glitchColor
      }
      break
    case 2:
      Icon = RiDice2Line
      break
    case 3:
      Icon = RiDice3Line
      break
    case 4:
      Icon = RiDice4Line
      break
    case 5:
      if (highlightHit) {
        Icon = RiDice5Fill
        iconProps.color = hitColor
      } else {
        Icon = RiDice5Line
      }
      break
    case 6:
      if (highlightHit) {
        Icon = RiDice6Fill
        iconProps.color = hitColor
      } else {
        Icon = RiDice6Line
      }
      break
    default:
      Icon = RiDiceLine
      break
  }

  return <Icon {...iconProps} />
}
