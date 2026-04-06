import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { LoanData } from "#/lib/system/loanData.ts"

export interface LoanCardProps {
  loan: LoanData
  onClick: (loan: LoanData) => void
}

export const LoanCard: FC<LoanCardProps> = ({ loan, onClick }) => (
  <Box
    onClick={() => onClick(loan)}
    sx={{
      "border": "1px solid",
      "borderColor": "divider",
      "borderRadius": 1,
      "padding": 1,
      "cursor": "pointer",
      "&:hover": { bgcolor: "action.hover" },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
      <Stack gap={0.5} flex={1} minWidth={0}>
        <Typography variant="body2" fontWeight="medium" noWrap title={loan.lender}>
          {loan.lender}
        </Typography>
        <Stack direction="row" gap={0.5} alignItems="center" flexWrap="wrap">
          {loan.interestRate > 0 && (
            <Chip
              label={`${loan.interestRate}%/mo`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
          {loan.notes && (
            <Typography variant="caption" color="text.secondary" noWrap title={loan.notes}>
              {loan.notes}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Typography variant="body1" fontWeight="medium" color="error.main" sx={{ whiteSpace: "nowrap" }}>
        -{formatNuyen(loan.amount)}
      </Typography>
    </Stack>
  </Box>
)
