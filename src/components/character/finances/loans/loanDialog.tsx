import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { selectNuyenAmount } from "#/components/character/finances/nuyen/nuyenSelectors.ts"
import { useNuyenStore } from "#/components/character/finances/nuyen/useNuyenStore.ts"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LoanData } from "#/system/loanData.ts"

export type LoanDialogMode = "add" | "edit"

interface LoanDialogProps {
  open: boolean
  mode: LoanDialogMode
  loan?: LoanData
  onClose: () => void
  onClosed?: () => void
}

const defaultLoanValues = (): Omit<LoanData, "id"> => ({
  lender: "",
  amount: 0,
  interestRate: 0,
  notes: "",
})

export const LoanDialog: FC<LoanDialogProps> = ({
  open,
  mode,
  loan,
  onClose,
  onClosed,
}) => {
  const nuyenStore = useNuyenStore()
  const isEditMode = mode === "edit"
  const currentNuyen = useStore(nuyenStore, selectNuyenAmount)

  const [lender, setLender] = useState(loan?.lender ?? "")
  const [amount, setAmount] = useState<number>(loan?.amount ?? 0)
  const [interestRate, setInterestRate] = useState<number>(loan?.interestRate ?? 0)
  const [notes, setNotes] = useState(loan?.notes ?? "")
  const [showPayoffConfirm, setShowPayoffConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const hasInsufficientNuyenForPayoff = loan !== undefined && currentNuyen < loan.amount
  const handleSave = () => {
    const loanData: LoanData = {
      id: loan?.id ?? NullUuid,
      lender,
      amount,
      interestRate,
      notes,
    }
    nuyenStore.saveLoan(loanData)
    onClose()
  }

  const handlePayoff = () => {
    if (!loan) return
    nuyenStore.payoffLoan(loan.id)
    setShowPayoffConfirm(false)
    onClose()
  }

  const handleRemove = () => {
    if (!loan) return
    nuyenStore.removeLoan(loan.id)
    setShowRemoveConfirm(false)
    onClose()
  }

  const handleClosed = () => {
    const defaults = defaultLoanValues()
    setLender(loan?.lender ?? defaults.lender)
    setAmount(loan?.amount ?? defaults.amount)
    setInterestRate(loan?.interestRate ?? defaults.interestRate)
    setNotes(loan?.notes ?? defaults.notes ?? "")
    setShowPayoffConfirm(false)
    setShowRemoveConfirm(false)
    onClosed?.()
  }

  const title = isEditMode ? "Edit Loan" : "Add Loan"

  return (
    <Dialog open={open} onTransitionExited={handleClosed} fullWidth>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Stack sx={{ gap: 2, padding: 1 }}>
          <TextField
            label="Lender"
            size="small"
            fullWidth
            value={lender}
            onChange={(e) => setLender(e.target.value)}
            placeholder="e.g. Slicus (NPC)"
            required
          />
          <TextField
            label="Amount Outstanding (¥)"
            size="small"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            label="Monthly Interest Rate (%)"
            size="small"
            fullWidth
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 0, step: 0.1 } }}
          />
          <TextField
            label="Notes"
            size="small"
            fullWidth
            multiline
            minRows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {showPayoffConfirm && (
            <>
              <Divider />
              {hasInsufficientNuyenForPayoff
                ? (
                    <Typography color="error.main">
                      Insufficient nuyen — need {formatNuyen(loan?.amount ?? 0)} to pay off,
                      have {formatNuyen(currentNuyen)}.
                    </Typography>
                  )
                : (
                    <Typography color="warning.main">
                      Pay off {formatNuyen(amount)} to {lender}? This will deduct {formatNuyen(amount)} from
                      your nuyen and remove the loan.
                    </Typography>
                  )}
              <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
                <Button size="small" onClick={() => setShowPayoffConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  color="warning"
                  variant="contained"
                  onClick={handlePayoff}
                  disabled={hasInsufficientNuyenForPayoff}
                >
                  Confirm Payoff
                </Button>
              </Stack>
            </>
          )}

          {showRemoveConfirm && (
            <>
              <Divider />
              <Typography color="error">
                Remove this loan record? The loan balance will not be paid.
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
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: 1, flexWrap: "wrap", gap: 1 }}>
        {isEditMode && !showPayoffConfirm && !showRemoveConfirm && (
          <>
            <Button
              color="error"
              size="small"
              onClick={() => setShowRemoveConfirm(true)}
            >
              Remove
            </Button>
            <Button
              color="warning"
              size="small"
              onClick={() => setShowPayoffConfirm(true)}
              disabled={hasInsufficientNuyenForPayoff}
            >
              Pay Off
            </Button>
          </>
        )}
        {!showPayoffConfirm && !showRemoveConfirm && (
          <>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleSave}
              disabled={!lender.trim()}
            >
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
