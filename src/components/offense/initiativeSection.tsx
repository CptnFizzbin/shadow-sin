import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { InitiativePassTracker } from "#/components/offense/initiativePassTracker.tsx"
import { InitiativeScoreDisplay } from "#/components/offense/initiativeScoreDisplay.tsx"
import { MovementSection } from "#/components/offense/movementSection.tsx"
import { useInitiative } from "#/components/offense/useInitiative.ts"
import { useMovementStore } from "#/components/offense/useMovementStore.ts"

export const InitiativeSection: FC = () => {
  const initiative = useInitiative()
  const movement = useMovementStore(initiative.initiativePasses)

  const handleResetRound = () => {
    movement.store.reset()
  }

  return (
    <Stack gap={1}>
      <Grid container columns={2} spacing={1} alignItems="center">
        <Grid size={1}>
          <InitiativeScoreDisplay score={initiative.initiativeScore} />
        </Grid>

        <Grid size={1}>
          <InitiativePassTracker numPasses={initiative.initiativePasses} />
        </Grid>

        <Grid size={2}>
          <Divider flexItem />
        </Grid>

        <Grid size={2}>
          <MovementSection movement={movement} />
        </Grid>

        <Grid size={2}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            fullWidth
            onClick={handleResetRound}
          >
            Reset Round
          </Button>
        </Grid>
      </Grid>
    </Stack>
  )
}
