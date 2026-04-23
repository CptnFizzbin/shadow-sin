import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { useState } from "react"

import { EndOfMonthDialog } from "#/components/character/finances/endOfMonth/endOfMonthDialog.tsx"
import { LifestyleSection } from "#/components/character/finances/lifestyle/lifestyleSection.tsx"
import { LoansSection } from "#/components/character/finances/loans/loansSection.tsx"
import { NuyenSection } from "#/components/character/finances/nuyen/nuyenSection.tsx"
import { selectNuyenAmount, selectLoans } from "#/components/character/finances/nuyen/nuyenSelectors.ts"
import { useNetWorth } from "#/components/character/finances/nuyen/useNetWorth.tsx"
import { useNuyenStore } from "#/components/character/finances/nuyen/useNuyenStore.ts"
import {
  selectLifestyleQuality,
  selectLifestyleMonthsPaid,
} from "#/components/character/profile/lifestyleSelectors.ts"
import { useLifestyleStore } from "#/components/character/profile/useLifestyleStore.ts"
import { CredstickSection } from "#/components/items/types/credsticks/credstickSection.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { Lifestyles } from "#/system/lifestyleType.ts"
import { calculateMonthlyInterest } from "#/system/loanData.ts"

export const Route = createFileRoute("/$characterId/finances")({
  component: RouteComponent,
})

function RouteComponent() {
  const nuyenStore = useNuyenStore()
  const lifestyleStore = useLifestyleStore()
  const [endOfMonthOpen, setEndOfMonthOpen] = useState(false)

  const netWorth = useNetWorth()
  const nuyenBalance = useStore(nuyenStore, selectNuyenAmount)
  const loans = useStore(nuyenStore, selectLoans)
  const loansBalance = loans.reduce((sum, loan) => sum + loan.amount, 0)

  const lifestyleQuality = useStore(lifestyleStore, selectLifestyleQuality)
  const lifestyleMonthsPaid = useStore(lifestyleStore, selectLifestyleMonthsPaid)
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
          onClick={() => setEndOfMonthOpen(true)}
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

      <LifestyleSection nuyenStore={nuyenStore} />

      <EndOfMonthDialog
        open={endOfMonthOpen}
        nuyenStore={nuyenStore}
        onClose={() => setEndOfMonthOpen(false)}
      />
    </Stack>
  )
}
