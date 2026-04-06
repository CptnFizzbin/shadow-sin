import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useNuyenStore } from "#/components/finances/useNuyenStore.ts"

export const NuyenSection: FC = () => {
  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const nuyenStore = useNuyenStore()

  const [editValue, setEditValue] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState<string>("")

  const handleStartEdit = () => {
    setEditValue(String(currentNuyen))
    setIsEditing(true)
  }

  const handleDirectSave = () => {
    const parsed = parseInt(editValue, 10)
    if (!Number.isNaN(parsed)) {
      nuyenStore.setAmount(parsed)
    }
    setIsEditing(false)
    setEditValue("")
  }

  const handleDirectCancel = () => {
    setIsEditing(false)
    setEditValue("")
  }

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
    <Stack gap={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">Nuyen Balance</Typography>
        {!isEditing && (
          <Button size="small" onClick={handleStartEdit}>
            Set
          </Button>
        )}
      </Stack>

      {isEditing
        ? (
            <Stack direction="row" gap={1} alignItems="center">
              <TextField
                size="small"
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                  },
                }}
                sx={{ flex: 1 }}
              />
              <Button size="small" variant="contained" color="secondary" onClick={handleDirectSave}>
                OK
              </Button>
              <Button size="small" onClick={handleDirectCancel}>
                Cancel
              </Button>
            </Stack>
          )
        : (
            <Typography variant="h5" fontWeight="bold" color={currentNuyen < 0 ? "error.main" : "text.primary"}>
              {currentNuyen.toLocaleString("en")}¥
            </Typography>
          )}

      <Stack direction="row" gap={1} alignItems="flex-end">
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
          Deposit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={!isAdjustValid}
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </Stack>
    </Stack>
  )
}
