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
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/lib/system/gear/credstickData.ts"
import {
  CredstickMaxBalance,
  CredstickPurchaseCost,
  CredstickType,
  CredstickTypeLabel,
} from "#/lib/system/gear/credstickData.ts"
import { createItem } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

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
  const currentNuyen = useStore(nuyenStore, (state) => state.current)

  const isEditMode = mode === "edit"
  const isCertified = mode === "add-certified"

  const [credstickName, setCredstickName] = useState(credstick?.name ?? "")
  const [credstickType, setCredstickType] = useState<CredstickType>(
    credstick?.credstickType ?? CredstickType.standard,
  )
  const [balance, setBalance] = useState<number>(
    credstick?.balance ?? CredstickMaxBalance[CredstickType.standard],
  )
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const maxBalance = CredstickMaxBalance[credstickType]
  const clampedBalance = Math.min(Math.max(0, balance), maxBalance)
  const certifiedTotalCost = CredstickPurchaseCost + clampedBalance
  const hasInsufficientNuyen = isCertified && currentNuyen < certifiedTotalCost

  const handleTypeChange = (newType: CredstickType) => {
    setCredstickType(newType)
    const newMax = CredstickMaxBalance[newType]
    if (!isEditMode) {
      setBalance(isCertified ? newMax : Math.min(balance, newMax))
    }
  }

  const handleSave = () => {
    if (hasInsufficientNuyen) return

    if (isEditMode && credstick) {
      const updatedCredstick: CredstickData = { ...credstick, name: credstickName, balance: clampedBalance }
      gearStore.save(updatedCredstick)
    } else {
      const credstickItemData: Omit<CredstickData, "id" | "childIds"> = {
        name: credstickName,
        itemType: ItemType.credstick,
        credstickType,
        balance: clampedBalance,
      }
      const [newCredstick] = createItem<CredstickData>(credstickItemData)
      gearStore.save(newCredstick)
      if (isCertified) {
        // Deduct purchase cost + loaded balance from nuyen
        nuyenStore.withdraw(CredstickPurchaseCost + clampedBalance)
      }
    }

    onClose()
  }

  /** Withdraws the full balance from the credstick and deletes it. */
  const handleWithdraw = () => {
    if (!credstick) return
    nuyenStore.deposit(credstick.balance)
    gearStore.remove(credstick)
    setShowWithdrawConfirm(false)
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
    setShowWithdrawConfirm(false)
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
        <Stack sx={{ gap: 2, padding: 1 }}>
          {isCertified && (
            <>
              <Typography color="text.secondary">
                Cost: {formatNuyen(CredstickPurchaseCost)} + loaded balance (deducted from your nuyen)
              </Typography>
              {hasInsufficientNuyen && (
                <Typography color="error.main">
                  Insufficient nuyen — need {formatNuyen(certifiedTotalCost)}, have {formatNuyen(currentNuyen)}.
                </Typography>
              )}
            </>
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
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography color="text.secondary">
                  Balance
                </Typography>
                <Typography sx={{ fontWeight: "medium" }}>
                  {formatNuyen(credstick.balance)}
                </Typography>
              </Stack>

              {showWithdrawConfirm && (
                <>
                  <Divider />
                  <Typography color="text.secondary">
                    Withdraw {formatNuyen(credstick.balance)} to your nuyen and delete this credstick?
                  </Typography>
                  <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
                    <Button size="small" onClick={() => setShowWithdrawConfirm(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={handleWithdraw}
                    >
                      Confirm Withdrawal
                    </Button>
                  </Stack>
                </>
              )}

              {showRemoveConfirm && (
                <>
                  <Divider />
                  <Typography color="error">
                    Remove this credstick? Any remaining balance will be lost.
                  </Typography>
                  <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
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
        {isEditMode && !showWithdrawConfirm && !showRemoveConfirm && (
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
              onClick={() => setShowWithdrawConfirm(true)}
              disabled={!credstick || credstick.balance <= 0}
            >
              Withdraw
            </Button>
          </>
        )}

        {!showWithdrawConfirm && !showRemoveConfirm && (
          <>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button color="secondary" variant="contained" onClick={handleSave} disabled={hasInsufficientNuyen}>
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
