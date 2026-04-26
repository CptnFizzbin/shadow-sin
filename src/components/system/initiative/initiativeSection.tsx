import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DiceRollButton } from "#/components/dice/diceRollButton.tsx"
import { InitiativePassTracker } from "#/components/system/initiative/initiativePassTracker.tsx"
import { useInitiative } from "#/components/system/initiative/useInitiative.ts"
import {
  useInitiativePassStore,
  useInitiativePassesCompleted,
  useInitiativeRolledScore,
} from "#/components/system/initiative/useInitiativePassStore.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const InitiativeSection: FC = () => {
  const { baseScore, initiativePasses } = useInitiative()
  const initiativePassStore = useInitiativePassStore()
  const rolledScore = useInitiativeRolledScore(initiativePassStore)
  const passesCompleted = useInitiativePassesCompleted(initiativePassStore)

  const totalScore = baseScore + (rolledScore ?? 0)
  const currentScore = totalScore - (passesCompleted.size * 10)

  const handleRoll = (results: number[]) => {
    initiativePassStore.setRolledScore(results[0])
  }

  const handleClearRoll = () => {
    initiativePassStore.clearRolledScore()
  }

  const handleResetRound = () => {
    initiativePassStore.resetPasses()
  }

  const rollResult = rolledScore !== undefined ? [rolledScore] : undefined

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

      <Grid size={2}>
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Initiative" />
          <Stack direction="row" sx={{ gap: 1, alignItems: "baseline", flexWrap: "wrap" }}>
            <Typography color="text.secondary">
              {`Base: ${baseScore}`}
            </Typography>
            {rolledScore !== undefined && (
              <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                {`= ${totalScore}`}
              </Typography>
            )}
          </Stack>
          <DiceRollButton
            count={1}
            result={rollResult}
            onRoll={handleRoll}
            onClear={handleClearRoll}
            label="Roll Initiative"
            displayMode="sum"
          />
          {rolledScore !== undefined && passesCompleted.size > 0 && (
            <Typography color="text.secondary">
              {`Current: ${currentScore}`}
            </Typography>
          )}
        </Stack>
      </Grid>

      <Grid size={2}>
        <InitiativePassTracker
          numPasses={initiativePasses}
          store={initiativePassStore}
        />
      </Grid>
    </Grid>
  )
}
