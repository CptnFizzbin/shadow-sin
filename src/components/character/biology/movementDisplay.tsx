import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { MovementData } from "#/system/movementData.ts"

interface MovementDisplayProps {
  movement: MovementData | MovementData[]
}

export const MovementDisplay: FC<MovementDisplayProps> = ({ movement }) => {
  const movementModes = Array.isArray(movement) ? movement : [movement]

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Movement (walk / run)" />
      {movementModes.map((mode, index) => {
        const modeLabel = mode.type
          ? mode.type.charAt(0).toUpperCase() + mode.type.slice(1)
          : "Ground"

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
