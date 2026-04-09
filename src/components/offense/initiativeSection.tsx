import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useInitiativeStore } from "#/components/offense/useInitiativeStore.ts"
import { Counter } from "#/components/ui/counter/counter.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const InitiativeSection: FC = () => {
  const initiative = useInitiativeStore()

  // Track which pass indices (0-based) the player has completed this round.
  // Using a Set means the count of passes can change reactively without needing
  // to resize a boolean array inside a useEffect.
  const [passesCompleted, setPassesCompleted] = useState<ReadonlySet<number>>(
    new Set(),
  )

  // Track movement consumed rather than movement remaining so the initial
  // value is always 0 and never needs to be synced with runMovement.
  const [movementUsed, setMovementUsed] = useState(0)

  const movementRemaining = Math.max(
    0,
    initiative.runMovement - movementUsed,
  )

  const handlePassToggle = (passIndex: number) => {
    setPassesCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(passIndex)) {
        next.delete(passIndex)
      } else {
        next.add(passIndex)
      }
      return next
    })
  }

  const handleResetRound = () => {
    setPassesCompleted(new Set())
    setMovementUsed(0)
  }

  return (
    <Stack gap={1}>
      <Grid container columns={2} spacing={1} alignItems="center">
        <Grid size={1}>
          <Stack alignItems="center" gap={0.5}>
            <Label label="Initiative Score" />
            <Typography variant="h4" textAlign="center" fontWeight="bold">
              {initiative.initiativeScore}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack alignItems="center" gap={0.5}>
            <Label label="Passes" />
            <Stack direction="row" gap={0.5} justifyContent="center">
              {Array.from({ length: initiative.initiativePasses }, (_, passIndex) => {
                const completed = passesCompleted.has(passIndex)
                return (
                  <Button
                    key={passIndex}
                    variant={completed ? "contained" : "outlined"}
                    color={completed ? "secondary" : "primary"}
                    onClick={() => handlePassToggle(passIndex)}
                    sx={{ minWidth: 40, width: 40, height: 40, padding: 0 }}
                  >
                    {passIndex + 1}
                  </Button>
                )
              })}
            </Stack>
          </Stack>
        </Grid>

        <Grid size={2}>
          <Divider flexItem />
        </Grid>

        <Grid size={2}>
          <Stack gap={0.5}>
            <Label label="Movement" />
            <Stack direction="row" gap={2} justifyContent="center">
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Walk
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {initiative.walkMovement}m
                </Typography>
              </Stack>
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Run
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {initiative.runMovement}m
                </Typography>
              </Stack>
            </Stack>
            <Counter
              label="Remaining"
              value={movementRemaining}
              min={0}
              max={initiative.runMovement}
              onChange={(newRemaining) =>
                setMovementUsed(initiative.runMovement - newRemaining)}
            />
          </Stack>
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
