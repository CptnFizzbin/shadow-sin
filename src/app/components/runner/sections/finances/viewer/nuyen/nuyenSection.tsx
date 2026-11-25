import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { Nuyen } from "#/forms/nuyen/nuyen.tsx"
import { NuyenInput } from "#/forms/nuyen/nuyenInput.tsx"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { Label } from "#/ui/text/label.tsx"

export const NuyenSection: FC = () => {
  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)
  const dispatch = useRunnerStoreDispatch()

  const [adjustValue, setAdjustValue] = useState<number | undefined>()

  const isAdjustValid = adjustValue !== undefined && adjustValue > 0

  const handleDeposit = () => {
    if (!isAdjustValid) return
    dispatch(Actions.nuyen.depositNuyen(adjustValue))
    setAdjustValue(undefined)
  }

  const handleWithdraw = () => {
    if (!isAdjustValid) return
    dispatch(Actions.nuyen.withdrawNuyen(adjustValue))
    setAdjustValue(undefined)
  }

  const handleSet = () => {
    if (!isAdjustValid) return
    dispatch(Actions.nuyen.setNuyenAmount(adjustValue))
    setAdjustValue(undefined)
  }

  return (
    <Stack>
      <Label label="Current Nuyen" />

      <Typography
        color={currentNuyen < 0 ? "error.main" : "text.primary"}
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        <Nuyen amount={currentNuyen} />
      </Typography>

      <Grid container columns={3} spacing={1}>
        <Grid size={3}>
          <NuyenInput label="Adjust" value={adjustValue} onChange={setAdjustValue} />
        </Grid>

        <Grid size={1}>
          <Button
            variant="outlined"
            color="success"
            disabled={!isAdjustValid}
            onClick={handleDeposit}
            fullWidth
          >
            Deposit
          </Button>
        </Grid>

        <Grid size={1}>
          <Button
            variant="outlined"
            color="error"
            disabled={!isAdjustValid}
            onClick={handleWithdraw}
            fullWidth
          >
            Withdraw
          </Button>
        </Grid>

        <Grid size={1}>
          <Button
            variant="outlined"
            disabled={!isAdjustValid}
            onClick={handleSet}
            fullWidth
          >
            Set
          </Button>
        </Grid>
      </Grid>
    </Stack>
  )
}
