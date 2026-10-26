import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"

import { useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/** Earn Karma step: how much karma the GM awarded. */
export const ManageKarmaStepEarn: FC = () => {
  const workflow = useManageKarmaWorkflow()

  return (
    <Stack sx={{ pt: 1 }}>
      <CounterInput
        label="Amount"
        min={1}
        value={workflow.data.amount}
        onChange={(amount) => workflow.setData((data) => {
          data.amount = amount ?? 0
        })}
        fullWidth
      />
    </Stack>
  )
}
