import type { IconButtonProps } from "@mui/material/IconButton"
import IconButton from "@mui/material/IconButton"
import { RiDiceLine } from "@remixicon/react"
import type { FC } from "react"

import { useDiceTray } from "./diceTrayContext.ts"

interface DiceRollButtonProps extends IconButtonProps {
  poolSize?: number
  autoRoll?: boolean
}

export const DiceRollButton: FC<DiceRollButtonProps> = ({
  poolSize,
  autoRoll,
  ...iconButtonProps
}) => {
  const diceTray = useDiceTray()

  const handleClick = () => {
    if (autoRoll) {
      diceTray.roll(poolSize ?? 1)
    } else {
      diceTray.setDice(poolSize ?? 1)
    }
  }

  return (
    <IconButton color="primary" {...iconButtonProps} onClick={handleClick}>
      <RiDiceLine />
    </IconButton>
  )
}
