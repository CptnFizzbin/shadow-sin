import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SpellSustainTarget } from "#/system/model/magic/spellData.ts"

interface SpellSustainTargetToggleProps {
  value: SpellSustainTarget
  onChange: (target: SpellSustainTarget) => void
}

/** Picks who a sustained Spell is cast on — only a Spell sustained on `Self` applies its effects to the Runner. */
export const SpellSustainTargetToggle: FC<SpellSustainTargetToggleProps> = ({ value, onChange }) => (
  <Stack sx={{ gap: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      Effects apply to
    </Typography>
    <ToggleButtonGroup
      value={value}
      exclusive
      fullWidth
      size="small"
      aria-label="Effects apply to"
      onChange={(_, target: SpellSustainTarget | null) => target && onChange(target)}
    >
      <ToggleButton value={SpellSustainTarget.Self}>Self</ToggleButton>
      <ToggleButton value={SpellSustainTarget.Other}>Other</ToggleButton>
    </ToggleButtonGroup>
  </Stack>
)
