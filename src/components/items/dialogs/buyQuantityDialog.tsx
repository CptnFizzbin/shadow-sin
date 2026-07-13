import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { NumberField } from "#/components/ui/form/fields/numberField.tsx"
import { NuyenField } from "#/components/ui/form/fields/nuyenField.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

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

  const currentNuyen = useRunnerStoreSelector((s) => s.nuyen.current)
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
