import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { WoundModLabel } from "#/components/system/damage/woundModLabel.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export const QuickDamageSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const physical = useRunnerSelector(DamageSelectors.track.physical)
  const stun = useRunnerSelector(DamageSelectors.track.stun)

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
            onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.physical, value: newValue }))}
          />
        </Grid>

        <Grid size={1}>
          <DamageTrack
            label="Stun"
            max={stun.max}
            current={stun.current}
            woundInterval={stun.woundInterval}
            onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.stun, value: newValue }))}
          />
        </Grid>

        <Grid size={2}>
          <WoundModLabel />
        </Grid>
      </Grid>

    </Stack>
  )
}
