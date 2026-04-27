import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { useDamageStore } from "#/components/system/damage/useDamageStore.ts"
import { WoundModLabel } from "#/components/system/damage/woundModLabel.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export const QuickDamageSection: FC = () => {
  const damageStore = useDamageStore()
  const physical = useSelector(damageStore, (state) => state.physical)
  const stun = useSelector(damageStore, (state) => state.stun)

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Damage" />

      <Grid container columns={2} size={2} spacing={1} sx={{ width: { sm: "100%", md: "50%" }, margin: "auto" }}>
        <Grid size={1}>
          <DamageTrack
            label="Physical"
            max={physical.max}
            current={physical.current}
            woundInterval={physical.woundInterval}
            allowOverflow
            onChange={(newValue) => damageStore.setDamage(DamageTrackKey.physical, newValue)}
          />
        </Grid>

        <Grid size={1}>
          <DamageTrack
            label="Stun"
            max={stun.max}
            current={stun.current}
            woundInterval={stun.woundInterval}
            onChange={(newValue) => damageStore.setDamage(DamageTrackKey.stun, newValue)}
          />
        </Grid>

        <Grid size={2}>
          <WoundModLabel />
        </Grid>
      </Grid>

    </Stack>
  )
}
