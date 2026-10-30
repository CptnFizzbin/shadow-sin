import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"

import { useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/** Edit Karma step: new current and total earned karma, set directly outside the rules. */
export const ManageKarmaStepEdit: FC = () => {
  const workflow = useManageKarmaWorkflow()

  return (
    <Stack sx={{ pt: 1, gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Set karma directly, without earning or spending it. The change is still recorded in the
        karma log.
      </Typography>
      <CounterInput
        label="Current"
        min={0}
        value={workflow.data.current}
        onChange={(current) => workflow.setData((data) => {
          data.current = current ?? 0
        })}
        fullWidth
      />
      <CounterInput
        label="Total Earned"
        min={0}
        value={workflow.data.total}
        onChange={(total) => workflow.setData((data) => {
          data.total = total ?? 0
        })}
        fullWidth
      />
      <TextField
        label="Reason"
        placeholder="Optional"
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
