import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import type { FC } from "react"

import { useInitiative } from "#/hooks/system/initiative/useInitiative.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"

import { InitiativePassTracker } from "./initiativePassTracker.tsx"
import { InitiativeScoreDisplay } from "./initiativeScoreDisplay.tsx"

export const InitiativeSection: FC = () => {
  const initiative = useInitiative()
  const dispatch = useRunnerStoreDispatch()

  const handleResetRound = () => {
    dispatch(Actions.initiative.resetPasses())
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
        <InitiativeScoreDisplay score={initiative.dicePool} />
      </Grid>

      <Grid size={1}>
        <InitiativePassTracker
          numPasses={initiative.initiativePasses}
        />
      </Grid>
    </Grid>
  )
}
