import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { NumberField } from "#/components/ui/form/fields/numberField.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"

export interface BuyQuantityDialogProps {
  open: boolean
  defaultCost: number
  onClose: () => void
  onPurchase: (quantity: number, totalCost: number) => void
}

export const BuyQuantityDialog: FC<BuyQuantityDialogProps> = ({
  open,
  defaultCost,
  onClose,
  onPurchase,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [costPerItem, setCostPerItem] = useState(defaultCost)
  const [discount, setDiscount] = useState(0)

  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const totalCost = Math.max(0, (costPerItem - discount) * quantity)
  const canAfford = currentNuyen >= totalCost

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ padding: 1 }}>Buy More</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </Button>

            <NumberField
              label="Quantity"
              size="small"
              value={quantity}
              onChange={setQuantity}
              min={1}
              step={1}
              sx={{ flex: 1 }}
              slotProps={{ htmlInput: { style: { textAlign: "center" } } }}
            />

            <Button
              size="small"
              variant="outlined"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </Button>
          </Stack>

          <Stack direction="row" sx={{ gap: 1 }}>
            <NumberField
              label="Cost per item"
              size="small"
              value={costPerItem}
              onChange={setCostPerItem}
              min={0}
              sx={{ flex: 1 }}
            />

            <NumberField
              label="Discount"
              size="small"
              value={discount}
              onChange={setDiscount}
              min={0}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          disabled={!canAfford}
          onClick={() => onPurchase(quantity, totalCost)}
        >
          Purchase (
          <Nuyen amount={totalCost} />
          )
        </Button>
      </DialogActions>
    </Dialog>
  )
}
