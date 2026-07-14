// fallow-ignore-file
import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { FC } from "react"

import { KarmaValue } from "./karmaValue.tsx"

interface KarmaChipProps extends Omit<ChipProps, "label"> {
  amount: number
}

export const KarmaChip: FC<KarmaChipProps> = ({
  amount,
  ...chipProps
}) => {
  return (
    <Chip
      size="small"
      {...chipProps}
      label={<KarmaValue amount={amount} />}
    />
  )
}
