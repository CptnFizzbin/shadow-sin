import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CounterField } from "#/components/ui/counter/counterField.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/ui/dialog/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { NumberField } from "#/components/ui/form/fields/numberField.tsx"
import { NuyenField } from "#/components/ui/form/fields/nuyenField.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"

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

  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const discountPercent = (discount / 100)
  const subTotal = Math.max(0, costPerItem * quantity)
  const discountTotal = subTotal * discountPercent
  const totalCost = subTotal - discountTotal
  const canAfford = currentNuyen >= totalCost

  return (
    <ControlledDialog ctrl={ctrl}>
      <Dialog.Title>Buy More</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ paddingTop: 2 }}>
          <Stack direction="row">
            <CounterField
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

export const useBuyQuantityDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseBuyQuantityDialogProps) => dialogApi.open<void>(
      (ctrl) => <BuyQuantityDialog ctrl={ctrl} {...props} />,
    ),
  }
}
