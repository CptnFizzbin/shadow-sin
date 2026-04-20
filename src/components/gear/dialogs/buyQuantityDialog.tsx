import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
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

  const handleQuantityChange = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isNaN(parsed) && parsed >= 1) {
      setQuantity(parsed)
    }
  }

  const handleCostChange = (value: string) => {
    const parsed = Number.parseFloat(value)
    if (!Number.isNaN(parsed) && parsed >= 0) {
      setCostPerItem(parsed)
    }
  }

  const handleDiscountChange = (value: string) => {
    const parsed = Number.parseFloat(value)
    if (!Number.isNaN(parsed) && parsed >= 0) {
      setDiscount(parsed)
    }
  }

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

            <TextField
              label="Quantity"
              size="small"
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              sx={{ flex: 1, textAlign: "center" }}
              slotProps={{ htmlInput: { min: 1, step: 1, style: { textAlign: "center" } } }}
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
            <TextField
              label="Cost per item"
              size="small"
              type="number"
              value={costPerItem}
              onChange={(e) => handleCostChange(e.target.value)}
              sx={{ flex: 1 }}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />

            <TextField
              label="Discount"
              size="small"
              type="number"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              sx={{ flex: 1 }}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
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
