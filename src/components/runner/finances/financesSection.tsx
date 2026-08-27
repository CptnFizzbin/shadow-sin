import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { selectNetWorth } from "#/hooks/runner/finances/nuyen/useNetWorth.tsx"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { NuyenSelectors } from "#/stores/runner/nuyen/nuyenSlice.selectors.ts"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"
import { calculateMonthlyInterest } from "#/system/loanData.ts"

import { useEndOfMonthDialog } from "./endOfMonth/endOfMonthDialog.tsx"
import { LifestyleSection } from "./lifestyle/lifestyleSection.tsx"
import { LoansSection } from "./loans/loansSection.tsx"
import { NuyenSection } from "./nuyen/nuyenSection.tsx"

export const FinancesSection: FC = () => {
  const endOfMonthDialog = useEndOfMonthDialog()

  const netWorth = useRunnerSelector(selectNetWorth)
  const nuyenBalance = useRunnerSelector(NuyenSelectors.selectAmount)
  const loans = useRunnerSelector(NuyenSelectors.selectLoans)
  const loansBalance = loans.reduce((sum, loan) => sum + loan.amount, 0)

  const lifestyleQuality = useRunnerSelector(ProfileSelectors.selectLifestyleQuality) ?? LifestyleType.Street
  const lifestyleMonthsPaid = useRunnerSelector(ProfileSelectors.selectLifestyleMonthsPaid) ?? 1
  const lifestyleUpkeep = Lifestyles[lifestyleQuality].upkeep

  const monthlyNuyenCost = lifestyleMonthsPaid === 0 ? lifestyleUpkeep : 0
  const monthlyInterest = loans
    .filter((l) => l.interestRate > 0)
    .reduce((sum, l) => sum + calculateMonthlyInterest(l), 0)
  const totalMonthlyExpenses = monthlyNuyenCost + monthlyInterest

  return (
    <Stack>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="outlined"
          color="warning"
          onClick={() => endOfMonthDialog.open()}
        >
          End of Month{totalMonthlyExpenses > 0 && <> — <Nuyen amount={totalMonthlyExpenses} /></>}
        </Button>
      </Stack>

      <Grid container columns={3} spacing={1}>
        <Grid size={1}>
          <Stack sx={{ alignItems: "center", flexGrow: 1 }}>
            <Label label="Nuyen" />
            <Typography color={nuyenBalance < 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={nuyenBalance} />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ alignItems: "center", flexGrow: 1 }}>
            <Label label="Loans" />
            <Typography color={loansBalance > 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={loansBalance} />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ alignItems: "center", flexGrow: 1 }}>
            <Label label="Net Worth" />
            <Typography color={netWorth < 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={netWorth} />
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <NuyenSection />

      <LoansSection />

      <LifestyleSection />

      {endOfMonthDialog.outlet}
    </Stack>
  )
}
