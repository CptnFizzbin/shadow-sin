import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { DamageCounter } from "#/components/character/quickPanel/damageCounter.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const QuickDamageSection: FC = () => {
  return (
    <Stack gap={0.5}>
      <Label label="Damage" variant="text" textAlign="left" />
      <Grid container columns={2} spacing={1}>
        <Grid size={1}>
          <DamageCounter trackKey="physical" label="Physical" />
        </Grid>
        <Grid size={1}>
          <DamageCounter trackKey="stun" label="Stun" />
        </Grid>
      </Grid>
    </Stack>
  )
}
