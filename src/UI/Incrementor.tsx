import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, IconButton } from "@mui/material"
import { FC } from "react"

export interface IncrementorProps {
  min?: number
  max?: number
  value: number

  onChange(value: number): void
}

export const Incrementor: FC<IncrementorProps> = ({
  min = -Infinity,
  max = Infinity,
  value,
  onChange,
}) => {
  return (
    <Box>
      <IconButton
        aria-label="subtract"
        size="small"
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={value <= min}
      >
        <FontAwesomeIcon icon={faMinus} />
      </IconButton>
      <Box sx={{ display: "inline-block", padding: "0 4px" }}>{value}</Box>
      <IconButton
        aria-label="add"
        size="small"
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value >= max}
      >
        <FontAwesomeIcon icon={faPlus} />
      </IconButton>
    </Box>
  )
}
