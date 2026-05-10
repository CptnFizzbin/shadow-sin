import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { CritterPowerData } from "#/system/powers/critterPowerData.ts"

interface InnatePowersDisplayProps {
  powers: CritterPowerData[]
}

export const InnatePowersDisplay: FC<InnatePowersDisplayProps> = ({ powers }) => {
  if (powers.length === 0) return null

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Innate Powers" />
      {powers.map((power) => (
        <Paper key={power.id} sx={{ paddingX: 1, paddingY: 0.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography>{power.name}</Typography>
            {power.source && (
              <Chip
                label={`${power.source.book} p.${power.source.page}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
