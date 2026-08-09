import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { LoanData } from "#/system/loanData.ts"

interface LoanCardProps {
  loan: LoanData
  onClick: (loan: LoanData) => void
}

export const LoanCard: FC<LoanCardProps> = ({ loan, onClick }) => (
  <Paper onClick={() => onClick(loan)} sx={{ padding: 1 }}>
    <Stack>

      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography sx={{ flexGrow: 1 }}>
          {loan.lender}
        </Typography>

        {loan.interestRate > 0 && (
          <Chip
            label={`${loan.interestRate}%/mo`}
            size="small"
            color="warning"
            variant="outlined"
          />
        )}

        <Typography color="error.main">
          <Nuyen amount={loan.amount} />
        </Typography>
      </Stack>

      <Stack direction="row" sx={{ gap: 0.5, alignItems: "center", flexWrap: "wrap" }}>
        {loan.notes && (
          <Typography color="text.secondary" noWrap title={loan.notes}>
            {loan.notes}
          </Typography>
        )}
      </Stack>
    </Stack>
  </Paper>
)
