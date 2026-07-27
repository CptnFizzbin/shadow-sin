import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { CredstickSection } from "#/components/items/types/credsticks/credstickSection.tsx"
import { useEndOfMonthDialog } from "#/components/runner/finances/endOfMonth/endOfMonthDialog.tsx"
import { LifestyleSection } from "#/components/runner/finances/lifestyle/lifestyleSection.tsx"
import { LoansSection } from "#/components/runner/finances/loans/loansSection.tsx"
import { NuyenSection } from "#/components/runner/finances/nuyen/nuyenSection.tsx"
import { useNetWorth } from "#/components/runner/finances/nuyen/useNetWorth.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"
import { calculateMonthlyInterest } from "#/system/loanData.ts"

export const Route = createFileRoute("/$runnerId/finances")({
  component: RouteComponent,
})

function RouteComponent() {
  const endOfMonthDialog = useEndOfMonthDialog()

  const netWorth = useNetWorth()
  const nuyenBalance = useRunnerStoreSelector(Selectors.nuyen.selectNuyenAmount)
  const loans = useRunnerStoreSelector(Selectors.nuyen.selectLoans)
  const loansBalance = loans.reduce((sum, loan) => sum + loan.amount, 0)

  const lifestyleQuality = useRunnerStoreSelector(Selectors.profile.selectLifestyleQuality) ?? LifestyleType.Street
  const lifestyleMonthsPaid = useRunnerStoreSelector(Selectors.profile.selectLifestyleMonthsPaid) ?? 1
  const lifestyleUpkeep = Lifestyles[lifestyleQuality].upkeep

  const monthlyNuyenCost = lifestyleMonthsPaid === 0 ? lifestyleUpkeep : 0
  const monthlyInterest = loans
    .filter((l) => l.interestRate > 0)
    .reduce((sum, l) => sum + calculateMonthlyInterest(l), 0)
  const totalMonthlyExpenses = monthlyNuyenCost + monthlyInterest

  return (
    <Stack>
      <SectionHeader>Finances</SectionHeader>

      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
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
          <Stack sx={{ alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Label label="Nuyen" />
            <Typography color={nuyenBalance < 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={nuyenBalance} />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Label label="Loans" />
            <Typography color={loansBalance > 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={loansBalance} />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Label label="Net Worth" />
            <Typography color={netWorth < 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={netWorth} />
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <NuyenSection />

      <CredstickSection />

      <LoansSection />

      <LifestyleSection />

      {endOfMonthDialog.dialog}
    </Stack>
  )
}
