import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { Duration } from "#/utils/duration/duration.ts"
import { DurationUnit, DurationUnitLabels } from "#/utils/duration/duration.ts"

import type { ControlledDialogProps } from "./controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "./dialog.tsx"

interface CustomDurationDialogProps extends ControlledDialogProps<Duration> {
  initialValue: Duration
}

const DurationDialog: FC<CustomDurationDialogProps> = ({ ctrl, onClose, initialValue }) => {
  const [duration, setDuration] = useState<Duration>(initialValue)

  const handleUnitChange = (unit: DurationUnit, unitValue: number | null) => {
    setDuration((prev) => {
      const next = { ...prev }
      if (unitValue) {
        next[unit] = unitValue
      } else {
        delete next[unit]
      }
      return next
    })
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={onClose} maxWidth="xs">
      <Dialog.Title>Custom Duration</Dialog.Title>
      <Dialog.Content dividers>
        <Stack sx={{ gap: 2 }}>
          {(Object.values(DurationUnit) as DurationUnit[]).map((unit) => (
            <Stack
              key={unit}
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}
            >
              <Typography>{DurationUnitLabels[unit]}</Typography>
              <CounterInput
                value={duration[unit] ?? 0}
                onChange={(unitValue) => handleUnitChange(unit, unitValue)}
                min={0}
              />
            </Stack>
          ))}
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button variant="contained" onClick={() => ctrl.close(duration)}>Save</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

/** Dialog for entering a `Duration` as counters, one per `DurationUnit`. */
export const useDurationDialog = () =>
  useDialog<Duration, { initialValue: Duration }>(
    (ctrl, props) => <DurationDialog ctrl={ctrl} {...props} />,
  )
