import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { MovementData } from "#data/attributes/movementData.ts"
import { Label } from "#ui/text/label.tsx"

interface MovementDisplayProps {
  movement: MovementData | MovementData[]
}

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const MovementDisplay: FC<MovementDisplayProps> = ({ movement }) => {
  const movementModes = Array.isArray(movement) ? movement : [movement]

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Movement (walk / run)" />
      {movementModes.map((mode, index) => {
        const modeLabel = mode.type ? capitalize(mode.type) : "Ground"

        return (
          <Paper key={mode.type ?? index} sx={{ paddingX: 1, paddingY: 0.5 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">{modeLabel}</Typography>
              <Typography>
                {mode.walk}
                {" / "}
                {mode.run}
              </Typography>
            </Stack>
          </Paper>
        )
      })}
    </Stack>
  )
}
