import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { selectEdgeCurrent } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { DiceRollButton } from "#/components/dice/diceRollButton.tsx"
import { InitiativePassTracker } from "#/components/system/initiative/initiativePassTracker.tsx"
import { useInitiative } from "#/components/system/initiative/useInitiative.ts"
import {
  useInitiativeGoingFirst,
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
  const goingFirst = useInitiativeGoingFirst(initiativePassStore)

  const edgeStore = useEdgeStore()
  const edgeCurrent = useStore(edgeStore, selectEdgeCurrent)

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

  const handleSeizeInitiative = () => {
    edgeStore.setCurrent(edgeCurrent - 1)
    initiativePassStore.setGoingFirst(true)
  }

  const handleCancelGoingFirst = () => {
    edgeStore.setCurrent(edgeCurrent + 1)
    initiativePassStore.setGoingFirst(false)
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
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Edge" />
          {goingFirst
            ? (
                <Chip
                  label="Going First"
                  color="warning"
                  variant="filled"
                  size="small"
                  onDelete={handleCancelGoingFirst}
                  sx={{ alignSelf: "flex-start" }}
                />
              )
            : (
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  disabled={edgeCurrent === 0}
                  onClick={handleSeizeInitiative}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {`Seize Initiative (Edge: ${edgeCurrent})`}
                </Button>
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
