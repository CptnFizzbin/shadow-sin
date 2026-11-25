import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { LifestyleSelectors } from "#/state/runner/lifestyle/lifestyle.selector.ts"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { hasLifestyleUpkeep, lifestylePrepayCost } from "#/system/model/finances/runnerLifestyle.ts"

type PrepayLifestyleDialogProps = ControlledDialogProps<void>

const PrepayLifestyleDialog: FC<PrepayLifestyleDialogProps> = ({ ctrl }) => {
  const dispatch = useRunnerStoreDispatch()

  const lifestyle = useRunnerSelector(LifestyleSelectors.select)
  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)

  const [rawMonths, setRawMonths] = useState("1")
  const months = parseInt(rawMonths, 10)
  const isMonthsValid = Number.isInteger(months) && months >= 1

  const nuyenCost = isMonthsValid ? lifestylePrepayCost(lifestyle, months) : 0
  const canAfford = nuyenCost <= currentNuyen
  const canPrepay = hasLifestyleUpkeep(lifestyle) && isMonthsValid && canAfford

  const handlePrepay = () => {
    if (!canPrepay) return
    dispatch(Actions.lifestyle.prepayLifestyle({ months, nuyenCost }))
    ctrl.close()
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>Prepay Lifestyle</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ padding: 1 }}>
          <Typography color="text.secondary">
            {lifestyle.name}: <Nuyen amount={lifestyle.upkeep} />/month, {lifestyle.monthsPaid} month{lifestyle.monthsPaid === 1 ? "" : "s"} prepaid
          </Typography>

          <TextField
            label="Months"
            type="number"
            size="small"
            fullWidth
            autoFocus
            value={rawMonths}
            onChange={(event) => setRawMonths(event.target.value)}
            error={!isMonthsValid}
            helperText={isMonthsValid ? undefined : "Enter at least 1 month"}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />

          <Divider />

          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.secondary">Total cost</Typography>
            <Typography color={canAfford ? "text.primary" : "error.main"}>
              <Nuyen amount={nuyenCost} />
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.secondary">Nuyen after</Typography>
            <Typography color={canAfford ? "text.primary" : "error.main"}>
              <Nuyen amount={currentNuyen - nuyenCost} />
            </Typography>
          </Stack>

          {!canAfford && (
            <Typography variant="body2" color="error.main">
              Not enough nuyen to prepay {months} month{months === 1 ? "" : "s"}.
            </Typography>
          )}
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button color="success" variant="contained" disabled={!canPrepay} onClick={handlePrepay}>
          Prepay
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

/** Dialog for prepaying one or more months of the Runner's lifestyle upkeep. */
export const usePrepayLifestyleDialog = () => useDialog<void>((ctrl) => <PrepayLifestyleDialog ctrl={ctrl} />)
