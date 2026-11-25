import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"

import { useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/** Earn Karma step: how much karma the GM awarded, and why. */
export const ManageKarmaStepEarn: FC = () => {
  const workflow = useManageKarmaWorkflow()

  return (
    <Stack sx={{ pt: 1, gap: 2 }}>
      <CounterInput
        label="Amount"
        min={1}
        value={workflow.data.amount}
        onChange={(amount) => workflow.setData((data) => {
          data.amount = amount ?? 0
        })}
        fullWidth
      />
      <TextField
        label="Reason"
        placeholder="Optional, e.g. the run it was awarded for"
        size="small"
        value={workflow.data.reason}
        onChange={(event) => workflow.setData((data) => {
          data.reason = event.target.value
        })}
        fullWidth
      />
    </Stack>
  )
}
