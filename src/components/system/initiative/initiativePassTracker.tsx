import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

interface InitiativePassTrackerProps {
  numPasses: number
}

export const InitiativePassTracker: FC<InitiativePassTrackerProps> = ({
  numPasses,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const completedSet = useRunnerStoreSelector(Selectors.initiative.selectPassesCompleted)

  return (
    <Stack sx={{ alignItems: "center", gap: 0.5 }}>
      <Label label="Passes" />
      <Stack direction="row" sx={{ gap: 0.5, justifyContent: "center" }}>
        {Array.from({ length: numPasses }, (_, passIndex) => {
          const completed = completedSet.has(passIndex)
          return (
            <Button
              key={passIndex}
              variant={completed ? "contained" : "outlined"}
              color={completed ? "secondary" : "primary"}
              onClick={() => dispatch(Actions.initiative.togglePass(passIndex))}
              sx={{ minWidth: 40, width: 40, height: 40, padding: 0 }}
            >
              {passIndex + 1}
            </Button>
          )
        })}
      </Stack>
    </Stack>
  )
}
