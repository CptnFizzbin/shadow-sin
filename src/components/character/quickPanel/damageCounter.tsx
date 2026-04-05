import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { Label } from "#/components/ui/text/label.tsx"

export type DamageTrackKey = "physical" | "stun"

interface DamageCounterProps {
  trackKey: DamageTrackKey
  label: string
}

const counterButtonSx = {
  "width": 32,
  "height": 32,
  "border": "1px solid",
  "borderColor": "primary.dark",
  "backgroundColor": "background.paper",
  "color": "text.primary",
  "cursor": "pointer",
  "fontSize": "1.25rem",
  "display": "flex",
  "alignItems": "center",
  "justifyContent": "center",
  "&:disabled": {
    borderColor: "action.disabled",
    color: "action.disabled",
    cursor: "not-allowed",
  },
  "&:hover:not(:disabled)": {
    backgroundColor: "primary.light",
    color: "common.black",
  },
} as const

export const DamageCounter: FC<DamageCounterProps> = ({ trackKey, label }) => {
  const damageStore = useDamageStore()
  const track = damageStore[trackKey]

  const increment = () => {
    track.setValue(Math.min(track.current + 1, track.max))
  }

  const decrement = () => {
    track.setValue(Math.max(0, track.current - 1))
  }

  return (
    <Stack alignItems="center" gap={0.5}>
      <Label label={label} />
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Box
          component="button"
          type="button"
          onClick={decrement}
          disabled={track.current <= 0}
          sx={counterButtonSx}
        >
          −
        </Box>
        <Typography variant="body1" sx={{ minWidth: 48, textAlign: "center" }}>
          {track.current} / {track.max}
        </Typography>
        <Box
          component="button"
          type="button"
          onClick={increment}
          disabled={track.current >= track.max}
          sx={counterButtonSx}
        >
          +
        </Box>
      </Stack>
    </Stack>
  )
}
