import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
  color?: string
}

export function DiceGroupDisplay({
  name,
  size,
  total = false,
  color,
}: DiceGroupDisplayProps) {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        gap: 1,
        paddingX: 1,
        backgroundColor: total ? "primary.dark" : undefined,
        color: color ?? (total ? "primary.contrastText" : undefined),
        fontWeight: total ? "bold" : "normal",
      }}
    >
      <Typography
        sx={{
          flexGrow: 1,
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          display: "flex",
          width: "2em",
          justifyContent: "flex-end",
        }}
      >
        {size}
      </Typography>
    </Stack>
  )
}
