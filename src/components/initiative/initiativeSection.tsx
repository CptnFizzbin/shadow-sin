import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import type { FC } from "react"

import { InitiativeScoreDisplay } from "#/components/initiative/initiativeScoreDisplay.tsx"
import { InitiativePassTracker } from "./initiativePassTracker.tsx"
import { useInitiative } from "./useInitiative.ts"
import { useInitiativePassStore } from "./useInitiativePassStore.ts"

export const InitiativeSection: FC = () => {
  const initiative = useInitiative()
  const initiativePassStore = useInitiativePassStore()

  const handleResetRound = () => {
    initiativePassStore.resetPasses()
  }

  return (
    <Grid container columns={2} spacing={1}>
      <Grid size={2}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleResetRound}
        >
          End Round
        </Button>
      </Grid>

      <Grid size={1}>
        <InitiativeScoreDisplay score={initiative.initiativeScore} />
      </Grid>

      <Grid size={1}>
        <InitiativePassTracker
          numPasses={initiative.initiativePasses}
          store={initiativePassStore}
        />
      </Grid>
    </Grid>
  )
}
