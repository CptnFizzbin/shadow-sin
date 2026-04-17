import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { SprintDialog } from "#/components/offense/sprintDialog.tsx"
import type { MovementInfo } from "#/components/offense/useMovementStore.ts"
import { Counter } from "#/components/ui/counter/counter.tsx"
import { Label } from "#/components/ui/text/label.tsx"

interface MovementSectionProps {
  movement: MovementInfo
}

export const MovementSection: FC<MovementSectionProps> = ({ movement }) => {
  const [sprintOpen, setSprintOpen] = useState(false)
  // Increment on each open so SprintDialog remounts with fresh state every time.
  const [sprintDialogKey, setSprintDialogKey] = useState(0)
  const { store, total, perPass, sprintBonus, used, modes } = movement

  const handleOpenSprint = () => {
    setSprintDialogKey((k) => k + 1)
    setSprintOpen(true)
  }

  return (
    <Stack gap={1}>
      <Label label="Movement" />

      <Stack direction="row" gap={2} justifyContent="center">
        <Stack alignItems="center">
          <Typography variant="caption" color="text.secondary">Walk</Typography>
          <Typography variant="body2" fontWeight="medium">{total.walk}m/t</Typography>
        </Stack>
        <Stack alignItems="center">
          <Typography variant="caption" color="text.secondary">Run</Typography>
          <Typography variant="body2" fontWeight="medium">
            {total.run}m/t{sprintBonus > 0 && ` (+${sprintBonus})`}
          </Typography>
        </Stack>
      </Stack>

      <Button
        variant="outlined"
        size="small"
        onClick={handleOpenSprint}
      >
        Sprint
      </Button>

      <Stack gap={0.5}>
        {perPass.map((passAllowance, passIndex) => {
          const mode = modes[passIndex] ?? "walk"
          const maxDistance = mode === "run" ? passAllowance.run : passAllowance.walk
          const distanceUsed = used[passIndex] ?? 0

          return (
            <Stack key={passIndex} direction="row" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                sx={{ minWidth: 16, textAlign: "center" }}
              >
                {passIndex + 1}
              </Typography>

              <Counter
                value={maxDistance - Math.min(distanceUsed, maxDistance)}
                min={0}
                max={maxDistance}
                onChange={(remaining) =>
                  store.setMovement(passIndex, maxDistance - remaining)}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 30, textAlign: "center" }}
              >
                m
              </Typography>

              <ButtonGroup size="small" variant="outlined">
                <Button
                  variant={mode === "walk" ? "contained" : "outlined"}
                  onClick={() => {
                    store.setMode(passIndex, "walk")
                    store.setMovement(
                      passIndex,
                      Math.min(distanceUsed, passAllowance.walk),
                    )
                  }}
                  sx={{ px: 1 }}
                >
                  Walk
                </Button>
                <Button
                  variant={mode === "run" ? "contained" : "outlined"}
                  onClick={() => {
                    store.setMode(passIndex, "run")
                    store.setMovement(
                      passIndex,
                      Math.min(distanceUsed, passAllowance.run),
                    )
                  }}
                  sx={{ px: 1 }}
                >
                  Run
                </Button>
              </ButtonGroup>
            </Stack>
          )
        })}
      </Stack>

      <SprintDialog
        key={sprintDialogKey}
        open={sprintOpen}
        sprintBonus={sprintBonus}
        strength={movement.strength}
        onClose={() => setSprintOpen(false)}
        onApply={(bonusMeters) => store.setSprintBonus(bonusMeters)}
      />
    </Stack>
  )
}
