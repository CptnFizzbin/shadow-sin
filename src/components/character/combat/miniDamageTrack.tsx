import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

export interface MiniDamageTrackProps {
  label: string
  current: number
  max: number
}

export const MiniDamageTrack: FC<MiniDamageTrackProps> = ({ label, current, max }) => (
  <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
    <Typography variant="caption" sx={{ minWidth: 14, color: "text.secondary" }}>
      {label}
    </Typography>
    <Stack direction="row" sx={{ gap: 0.25, flexWrap: "wrap" }}>
      {Array.from({ length: max }, (_, i) => (
        <Box
          key={i}
          sx={{
            width: 9,
            height: 9,
            borderRadius: 0.5,
            bgcolor: i < current ? "error.main" : "action.disabled",
          }}
        />
      ))}
    </Stack>
    <Typography variant="caption" color={current > 0 ? "error" : "text.secondary"}>
      {current}/{max}
    </Typography>
  </Stack>
)
