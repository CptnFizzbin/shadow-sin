import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { Label } from "#/components/ui/text/label.tsx"

interface InitiativePassTrackerProps {
  numPasses: number
  onPassesChange?: (completed: ReadonlySet<number>) => void
}

export const InitiativePassTracker: FC<InitiativePassTrackerProps> = ({
  numPasses,
  onPassesChange,
}) => {
  const [passesCompleted, setPassesCompleted] = useState<ReadonlySet<number>>(
    new Set(),
  )

  const handleToggle = (passIndex: number) => {
    setPassesCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(passIndex)) {
        next.delete(passIndex)
      } else {
        next.add(passIndex)
      }
      onPassesChange?.(next)
      return next
    })
  }

  return (
    <Stack alignItems="center" gap={0.5}>
      <Label label="Passes" />
      <Stack direction="row" gap={0.5} justifyContent="center">
        {Array.from({ length: numPasses }, (_, passIndex) => {
          const completed = passesCompleted.has(passIndex)
          return (
            <Button
              key={passIndex}
              variant={completed ? "contained" : "outlined"}
              color={completed ? "secondary" : "primary"}
              onClick={() => handleToggle(passIndex)}
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
