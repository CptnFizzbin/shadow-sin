import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const QuickNuyenSection: FC = () => {
  const nuyenStore = useNuyenStore()
  const currentNuyen = useStore(nuyenStore, (state) => state.current)

  const [adjustAmount, setAdjustAmount] = useState<string>("")

  const adjustValue = parseInt(adjustAmount, 10)
  const isAdjustValid = !Number.isNaN(adjustValue) && adjustValue > 0

  const handleDeposit = () => {
    if (!isAdjustValid) return
    nuyenStore.deposit(adjustValue)
    setAdjustAmount("")
  }

  const handleWithdraw = () => {
    if (!isAdjustValid) return
    nuyenStore.withdraw(adjustValue)
    setAdjustAmount("")
  }

  return (
    <Stack gap={0.5}>
      <Label label="Nuyen" variant="text" />

      <Typography color={currentNuyen < 0 ? "error.main" : "text.primary"}>
        {currentNuyen.toLocaleString("en")}¥
      </Typography>

      <Stack direction="row" gap={0.5} alignItems="flex-end">
        <TextField
          label="Amount"
          size="small"
          type="number"
          value={adjustAmount}
          onChange={(e) => setAdjustAmount(e.target.value)}
          slotProps={{
            htmlInput: { min: 0 },
            input: {
              startAdornment: <InputAdornment position="start">¥</InputAdornment>,
            },
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          size="small"
          color="success"
          disabled={!isAdjustValid}
          onClick={handleDeposit}
        >
          +
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={!isAdjustValid}
          onClick={handleWithdraw}
        >
          −
        </Button>
      </Stack>
    </Stack>
  )
}
