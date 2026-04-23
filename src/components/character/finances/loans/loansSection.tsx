import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { LoanCard } from "#/components/character/finances/loans/loanCard.tsx"
import type { LoanDialogMode } from "#/components/character/finances/loans/loanDialog.tsx"
import { LoanDialog } from "#/components/character/finances/loans/loanDialog.tsx"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { LoanData } from "#/system/loanData.ts"

type DialogState = { open: boolean, mode: LoanDialogMode, loan?: LoanData } | null

export const LoansSection: FC = () => {
  const loans = useCharacterSheet((s) => s.nuyen.loans)
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const handleCardClick = (loan: LoanData) => {
    setDialogState({ open: true, mode: "edit", loan })
  }

  const totalOwed = loans.reduce((sum, loan) => sum + loan.amount, 0)

  return (
    <Stack>
      <Label label="Loans" />

      {loans.length > 0 && (
        <Typography color="error.main" sx={{ textAlign: "right", paddingRight: 1 }}>
          Total owed: {totalOwed.toLocaleString("en")}¥
        </Typography>
      )}

      {loans.length === 0 && (
        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
          No active loans
        </Typography>
      )}

      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} onClick={handleCardClick} />
      ))}

      <Button
        size="small"
        variant="outlined"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true, mode: "add" })}
      >
        Add Loan
      </Button>

      {dialogState !== null && (
        <LoanDialog
          open={dialogState.open}
          mode={dialogState.mode}
          loan={dialogState.loan}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
