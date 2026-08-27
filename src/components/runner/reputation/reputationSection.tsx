import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useAdjustReputationDialog } from "./adjustReputationDialog.tsx"
import { ReputationDisplay } from "./reputationDisplay.tsx"

export const ReputationSection: FC = () => {
  const adjustReputationDialog = useAdjustReputationDialog()

  return (
    <Stack sx={{ gap: 1 }}>
      <ReputationDisplay />

      <Button variant="outlined" fullWidth onClick={() => adjustReputationDialog.open()}>
        Adjust Reputation
      </Button>

      {adjustReputationDialog.outlet}
    </Stack>
  )
}
