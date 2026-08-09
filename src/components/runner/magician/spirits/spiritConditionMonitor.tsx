import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { calculateSpiritConditionMonitor } from "#/system/magic/spiritData.ts"

interface SpiritConditionMonitorProps {
  spirit: SpiritData
  onChange: (damage: SpiritData["damage"]) => void
}

export const SpiritConditionMonitor: FC<SpiritConditionMonitorProps> = ({ spirit, onChange }) => {
  const { physical: physicalMax, stun: stunMax } = calculateSpiritConditionMonitor(spirit.force, spirit.spiritType)
  const { physical, stun } = spirit.damage

  const isDestroyed = physical >= physicalMax

  return (
    <Stack>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Label label="Condition Monitor" variant="text" />
        {isDestroyed && <Chip label="Destroyed" color="error" size="small" />}
      </Stack>

      <Grid container columns={2} spacing={1}>
        <Grid size={1}>
          <DamageTrack
            label="Physical"
            max={physicalMax}
            current={physical}
            onChange={(value) => onChange({ ...spirit.damage, physical: Math.min(value, physicalMax) })}
          />
        </Grid>
        <Grid size={1}>
          <DamageTrack
            label="Stun"
            max={stunMax}
            current={stun}
            onChange={(value) => {
              const newStun = Math.min(value, stunMax)
              const overflow = value > stunMax ? value - stunMax : 0
              onChange({
                physical: Math.min(physical + overflow, physicalMax),
                stun: newStun,
              })
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  )
}
