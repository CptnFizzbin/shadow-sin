import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import type { FC } from "react"

import { InitiativePassTracker } from "#/components/system/initiative/initiativePassTracker.tsx"
import { InitiativeScoreDisplay } from "#/components/system/initiative/initiativeScoreDisplay.tsx"
import { useInitiative } from "#/components/system/initiative/useInitiative.ts"
import { useInitiativePassStore } from "#/components/system/initiative/useInitiativePassStore.ts"

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
