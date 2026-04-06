import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import type { LoanDialogMode } from "#/components/finances/dialogs/loanDialog.tsx"
import { LoanDialog } from "#/components/finances/dialogs/loanDialog.tsx"
import { LoanCard } from "#/components/finances/loanCard.tsx"
import type { LoanData } from "#/lib/system/loanData.ts"

type DialogState = { open: boolean, mode: LoanDialogMode, loan?: LoanData } | null

export const LoansSection: FC = () => {
  const loans = useCharacterSheet((s) => s.nuyen.loans)
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const handleCardClick = (loan: LoanData) => {
    setDialogState({ open: true, mode: "edit", loan })
  }

  const totalOwed = loans.reduce((sum, loan) => sum + loan.amount, 0)

  return (
    <>
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography variant="subtitle2">Loans</Typography>
            {loans.length > 0 && (
              <Typography variant="caption" color="error.main">
                Total owed: {totalOwed.toLocaleString("en")}¥
              </Typography>
            )}
          </Stack>
          <Button
            size="small"
            startIcon={<RiAddLine size={14} />}
            onClick={() => setDialogState({ open: true, mode: "add" })}
          >
            Add Loan
          </Button>
        </Stack>

        {loans.length === 0
          ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No active loans
              </Typography>
            )
          : (
              <Stack gap={0.5}>
                {loans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} onClick={handleCardClick} />
                ))}
              </Stack>
            )}
      </Stack>

      {dialogState !== null && (
        <LoanDialog
          open={dialogState.open}
          mode={dialogState.mode}
          loan={dialogState.loan}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </>
  )
}
