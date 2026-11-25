import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/forms/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/forms/dialog/dialog.tsx"
import { useDialog } from "#/forms/dialog/useDialog.tsx"
import { Nuyen } from "#/forms/nuyen/nuyen.tsx"
import { NuyenField } from "#/forms/nuyen/nuyenField.tsx"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { NumberField } from "#/ui/form/fields/numberField.tsx"
import { CounterInput } from "#/ui/form/inputs/counter/counterInput.tsx"

interface BuyQuantityDialogProps extends ControlledDialogProps<void> {
  defaultCost: number
  onPurchase: (quantity: number, totalCost: number) => void
}

const BuyQuantityDialog: FC<BuyQuantityDialogProps> = ({
  ctrl,
  defaultCost,
  onPurchase,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [costPerItem, setCostPerItem] = useState(defaultCost)
  const [discount, setDiscount] = useState(0)

  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)
  const discountPercent = (discount / 100)
  const subTotal = Math.max(0, costPerItem * quantity)
  const discountTotal = subTotal * discountPercent
  const totalCost = subTotal - discountTotal
  const canAfford = currentNuyen >= totalCost

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>Buy More</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ paddingTop: 2 }}>
          <Stack direction="row">
            <CounterInput
              label="Quantity"
              size="small"
              value={quantity}
              onChange={(value) => setQuantity(value ?? 1)}
              min={1}
              step={1}
            />

            <NuyenField
              label="Cost per item"
              size="small"
              value={costPerItem}
              onChange={(value) => setCostPerItem(value ?? 0)}
              sx={{ flex: 1 }}
            />
          </Stack>

          <NumberField
            label="Discount"
            size="small"
            value={discount}
            onChange={(value) => setDiscount(value ?? 0)}
            min={0}
            max={100}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
            }}
          />
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          disabled={totalCost !== 0 && !canAfford}
          onClick={() => {
            onPurchase(quantity, totalCost)
            ctrl.close()
          }}
        >
          Purchase (
          <Nuyen amount={totalCost} />
          )
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseBuyQuantityDialogProps = Omit<BuyQuantityDialogProps, keyof ControlledDialogProps<void>>

export const useBuyQuantityDialog = () => useDialog<void, UseBuyQuantityDialogProps>(
  (ctrl, props) => <BuyQuantityDialog ctrl={ctrl} {...props} />,
)
