import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import { isNewLoan } from "#/lib/stores/runner/nuyen/nuyenSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LoanData } from "#/system/loanData.ts"

type LoanDialogMode = "add" | "edit"

interface LoanDialogProps extends ControlledDialogProps<void> {
  mode: LoanDialogMode
  loan?: LoanData
}

const defaultLoanValues = (): Omit<LoanData, "id"> => ({
  lender: "",
  amount: 0,
  interestRate: 0,
  notes: "",
})

const LoanDialog: FC<LoanDialogProps> = ({
  ctrl,
  mode,
  loan,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const isEditMode = mode === "edit"
  const currentNuyen = useRunnerStoreSelector(Selectors.nuyen.selectNuyenAmount)

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
    dispatch(isNewLoan(loanData) ? Actions.nuyen.addLoan(loanData) : Actions.nuyen.updateLoan(loanData))
    ctrl.close()
  }

  const handlePayoff = () => {
    if (!loan) return
    dispatch(Actions.nuyen.payoffLoan(loan.id))
    setShowPayoffConfirm(false)
    ctrl.close()
  }

  const handleRemove = () => {
    if (!loan) return
    dispatch(Actions.nuyen.removeLoan(loan.id))
    setShowRemoveConfirm(false)
    ctrl.close()
  }

  const handleClosed = () => {
    const defaults = defaultLoanValues()
    setLender(loan?.lender ?? defaults.lender)
    setAmount(loan?.amount ?? defaults.amount)
    setInterestRate(loan?.interestRate ?? defaults.interestRate)
    setNotes(loan?.notes ?? defaults.notes ?? "")
    setShowPayoffConfirm(false)
    setShowRemoveConfirm(false)
  }

  const title = isEditMode ? "Edit Loan" : "Add Loan"

  return (
    <ControlledDialog ctrl={ctrl} onClose={false} onClosed={handleClosed}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
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
      </Dialog.Content>
      <Dialog.Actions>
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
            <Button color="secondary" onClick={() => ctrl.close()}>
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
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseLoanDialogProps = Omit<LoanDialogProps, keyof ControlledDialogProps<void>>

export const useLoanDialog = () => useDialog<void, UseLoanDialogProps>(
  (ctrl, props) => <LoanDialog ctrl={ctrl} {...props} />,
)
