import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"

import type { InitiativePassStore } from "./useInitiativePassStore.ts"
import { useInitiativePassesCompleted } from "./useInitiativePassStore.ts"

interface InitiativePassTrackerProps {
  numPasses: number
  store: InitiativePassStore
}

export const InitiativePassTracker: FC<InitiativePassTrackerProps> = ({
  numPasses,
  store,
}) => {
  const completedSet = useInitiativePassesCompleted(store)

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
              onClick={() => store.togglePass(passIndex)}
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
