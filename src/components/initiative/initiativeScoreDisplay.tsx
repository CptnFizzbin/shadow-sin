import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"

interface InitiativeScoreDisplayProps {
  score: number
}

export const InitiativeScoreDisplay: FC<InitiativeScoreDisplayProps> = ({ score }) => (
  <Stack gap={0.5}>
    <Label label="Initiative Score" />
    <Typography textAlign="center" fontWeight="bold">
      {score}
    </Typography>
  </Stack>
)
