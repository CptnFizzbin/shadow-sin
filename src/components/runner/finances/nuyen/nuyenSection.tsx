import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const NuyenSection: FC = () => {
  const currentNuyen = useRunnerStoreSelector(Selectors.nuyen.selectNuyenAmount)
  const dispatch = useRunnerStoreDispatch()

  const [adjustAmount, setAdjustAmount] = useState<string>("")

  const adjustValue = parseInt(adjustAmount, 10)
  const isAdjustValid = !Number.isNaN(adjustValue) && adjustValue > 0

  const handleDeposit = () => {
    if (!isAdjustValid) return
    dispatch(Actions.nuyen.depositNuyen(adjustValue))
    setAdjustAmount("")
  }

  const handleWithdraw = () => {
    if (!isAdjustValid) return
    dispatch(Actions.nuyen.withdrawNuyen(adjustValue))
    setAdjustAmount("")
  }

  const handleSet = () => {
    if (!isAdjustValid) return
    dispatch(Actions.nuyen.setNuyenAmount(adjustValue))
    setAdjustAmount("")
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
          <TextField
            label="Adjust"
            type="number"
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
            slotProps={{
              htmlInput: { min: 0 },
              input: {
                startAdornment: <InputAdornment position="start">¥</InputAdornment>,
              },
            }}
            fullWidth
          />
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
