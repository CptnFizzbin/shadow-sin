import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import type { LoanData } from "#/system/loanData.ts"

import { LoanCard } from "./loanCard.tsx"
import { useLoanDialog } from "./loanDialog.tsx"

export const LoansSection: FC = () => {
  const loans = useRunnerSelector(({ nuyen }) => nuyen.loans)
  const loanDialog = useLoanDialog()

  const handleCardClick = (loan: LoanData) => {
    loanDialog.open({ mode: "edit", loan })
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
        onClick={() => loanDialog.open({ mode: "add" })}
      >
        Add Loan
      </Button>

      {loanDialog.dialog}
    </Stack>
  )
}
