import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useNuyenStore } from "#/components/finances/useNuyenStore.ts"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/lib/system/gear/credstickData.ts"
import {
  CredstickMaxBalance,
  CredstickPurchaseCost,
  CredstickType,
  CredstickTypeLabel,
} from "#/lib/system/gear/credstickData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import { createItem } from "#/lib/system/itemData.ts"

export type CredstickDialogMode = "add" | "add-certified" | "edit"

export interface CredstickDialogProps {
  open: boolean
  mode: CredstickDialogMode
  credstick?: CredstickData
  onClose: () => void
  onClosed?: () => void
}

export const CredstickDialog: FC<CredstickDialogProps> = ({
  open,
  mode,
  credstick,
  onClose,
  onClosed,
}) => {
  const gearStore = useGearStore()
  const nuyenStore = useNuyenStore()

  const isEditMode = mode === "edit"
  const isCertified = mode === "add-certified"

  const [credstickName, setCredstickName] = useState(credstick?.name ?? "")
  const [credstickType, setCredstickType] = useState<CredstickType>(
    credstick?.credstickType ?? CredstickType.standard,
  )
  const [balance, setBalance] = useState<number>(
    credstick?.balance ?? CredstickMaxBalance[CredstickType.standard],
  )
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const maxBalance = CredstickMaxBalance[credstickType]

  const handleTypeChange = (newType: CredstickType) => {
    setCredstickType(newType)
    const newMax = CredstickMaxBalance[newType]
    if (!isEditMode) {
      setBalance(isCertified ? newMax : Math.min(balance, newMax))
    }
  }

  const handleSave = () => {
    const clampedBalance = Math.min(Math.max(0, balance), maxBalance)

    if (isEditMode && credstick) {
      const updatedCredstick: CredstickData = { ...credstick, name: credstickName, balance: clampedBalance }
      gearStore.save(updatedCredstick)
    } else {
      const credstickItemData: Omit<CredstickData, "id" | "childIds"> = {
        name: credstickName,
        itemType: GearType.credstick,
        credstickType,
        balance: clampedBalance,
      }
      const [newCredstick] = createItem<CredstickData>(credstickItemData)
      gearStore.save(newCredstick)
      if (isCertified) {
        nuyenStore.withdraw(CredstickPurchaseCost)
      }
    }

    onClose()
  }

  const handleWithdraw = () => {
    if (!credstick) return
    const amount = Math.min(Math.max(0, withdrawAmount), credstick.balance)
    nuyenStore.deposit(amount)
    const updatedCredstick: CredstickData = { ...credstick, balance: credstick.balance - amount }
    gearStore.save(updatedCredstick)
    setShowWithdraw(false)
    onClose()
  }

  const handleRemove = () => {
    if (!credstick) return
    gearStore.remove(credstick)
    setShowRemoveConfirm(false)
    onClose()
  }

  const handleClosed = () => {
    setCredstickName(credstick?.name ?? "")
    setCredstickType(credstick?.credstickType ?? CredstickType.standard)
    setBalance(credstick?.balance ?? CredstickMaxBalance[CredstickType.standard])
    setWithdrawAmount(0)
    setShowWithdraw(false)
    setShowRemoveConfirm(false)
    onClosed?.()
  }

  const title = isEditMode
    ? "Edit Credstick"
    : isCertified
      ? "Create Certified Credstick"
      : "Add Credstick"

  return (
    <Dialog open={open} onTransitionExited={handleClosed} fullWidth>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Stack gap={2} sx={{ padding: 1 }}>
          {isCertified && (
            <Typography variant="body2" color="text.secondary">
              Cost: {formatNuyen(CredstickPurchaseCost)} (deducted from your nuyen)
            </Typography>
          )}

          <TextField
            label="Name"
            size="small"
            fullWidth
            value={credstickName}
            onChange={(e) => setCredstickName(e.target.value)}
            placeholder={isEditMode ? "" : "e.g. Paid by Fixer"}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={credstickType}
              label="Type"
              onChange={(e) => handleTypeChange(e.target.value as CredstickType)}
              disabled={isEditMode}
            >
              {Object.values(CredstickType).map((type) => (
                <MenuItem key={type} value={type}>
                  {CredstickTypeLabel[type]} (max {formatNuyen(CredstickMaxBalance[type])})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!isEditMode && (
            <TextField
              label="Balance"
              size="small"
              fullWidth
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 0, max: maxBalance } }}
              helperText={`Max: ${formatNuyen(maxBalance)}`}
            />
          )}

          {isEditMode && credstick && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Balance
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatNuyen(credstick.balance)}
                </Typography>
              </Stack>

              {showWithdraw && (
                <>
                  <Divider />
                  <Typography variant="subtitle2">Withdraw funds</Typography>
                  <TextField
                    label="Amount to withdraw"
                    size="small"
                    fullWidth
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    slotProps={{ htmlInput: { min: 0, max: credstick.balance } }}
                    helperText={`Available: ${formatNuyen(credstick.balance)}`}
                    autoFocus
                  />
                  <Stack direction="row" gap={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => setShowWithdraw(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={handleWithdraw}
                      disabled={withdrawAmount <= 0 || withdrawAmount > credstick.balance}
                    >
                      Confirm Withdrawal
                    </Button>
                  </Stack>
                </>
              )}

              {showRemoveConfirm && (
                <>
                  <Divider />
                  <Typography variant="body2" color="error">
                    Remove this credstick? Any remaining balance will be lost.
                  </Typography>
                  <Stack direction="row" gap={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => setShowRemoveConfirm(false)}>
                      Cancel
                    </Button>
                    <Button size="small" color="error" variant="contained" onClick={handleRemove}>
                      Confirm Remove
                    </Button>
                  </Stack>
                </>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: 1, flexWrap: "wrap", gap: 1 }}>
        {isEditMode && !showWithdraw && !showRemoveConfirm && (
          <>
            <Button
              color="error"
              size="small"
              onClick={() => setShowRemoveConfirm(true)}
            >
              Remove
            </Button>
            <Button
              color="secondary"
              size="small"
              onClick={() => {
                setWithdrawAmount(0)
                setShowWithdraw(true)
              }}
              disabled={!credstick || credstick.balance <= 0}
            >
              Withdraw
            </Button>
          </>
        )}

        {!showWithdraw && !showRemoveConfirm && (
          <>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button color="secondary" variant="contained" onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
