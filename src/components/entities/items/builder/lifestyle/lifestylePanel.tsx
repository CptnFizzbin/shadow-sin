import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { LifestyleFields } from "#/components/runner/sections/finances/lifestyle/lifestyleFields.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { LifestyleSelectors } from "#/state/runner/lifestyle/lifestyle.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const LifestylePanel: FC = () => {
  const dispatch = useRunnerStoreDispatch()

  const upkeep = useRunnerSelector(LifestyleSelectors.selectUpkeep)
  const monthsPaid = useRunnerSelector(LifestyleSelectors.selectMonthsPaid)
  const totalCost = useRunnerSelector(LifestyleSelectors.selectPrepaidCost)

  return (
    <Stack>
      <LifestyleFields />

      {upkeep > 0 && (
        <>
          <TextField
            label="Months prepaid"
            type="number"
            size="small"
            fullWidth
            value={monthsPaid}
            slotProps={{ htmlInput: { min: 1 } }}
            onChange={(event) => {
              const months = Math.max(1, parseInt(event.target.value, 10) || 1)
              dispatch(Actions.lifestyle.setLifestyleMonthsPaid(months))
            }}
          />

          <Typography color="text.secondary">
            Monthly upkeep: <Nuyen amount={upkeep} />
            {monthsPaid > 1 && (
              <>× {monthsPaid} months = <Nuyen amount={totalCost} /></>
            )}
          </Typography>
        </>
      )}

      {upkeep < 0 && (
        <Typography color="text.secondary">
          Monthly income: <Nuyen amount={-upkeep} />
        </Typography>
      )}
    </Stack>
  )
}
