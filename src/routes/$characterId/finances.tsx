import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"

import { CredstickSection } from "#/components/finances/credsticks/credstickSection.tsx"
import { LifestyleSection } from "#/components/finances/lifestyle/lifestyleSection.tsx"
import { LoansSection } from "#/components/finances/loans/loansSection.tsx"
import { NuyenSection } from "#/components/finances/nuyen/nuyenSection.tsx"
import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { useLifestyleStore } from "#/components/profile/useLifestyleStore.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { Lifestyles } from "#/lib/system/lifestyleType.ts"
import { useNetWorth } from "../../components/finances/nuyen/useNetWorth.tsx"

export const Route = createFileRoute("/$characterId/finances")({
  component: RouteComponent,
})

function RouteComponent() {
  const nuyenStore = useNuyenStore()
  const lifestyleStore = useLifestyleStore()

  const netWorth = useNetWorth()
  const nuyenBalance = useStore(nuyenStore, (state) => state.current)
  const loansBalance = useStore(nuyenStore, (state) => state.loans.reduce((sum, loan) => sum + loan.amount, 0))

  const handleEndOfMonth = () => {
    nuyenStore.endOfMonth()

    const lifestyle = lifestyleStore.state
    const upkeep = Lifestyles[lifestyle.quality].upkeep
    if (upkeep > 0) {
      if (lifestyle.monthsPaid > 1) {
        lifestyleStore.setMonthsPaid(lifestyle.monthsPaid - 1)
      } else {
        nuyenStore.withdraw(upkeep)
      }
    }
  }

  return (
    <Stack>
      <SectionHeader>Finances</SectionHeader>

      <Grid container columns={3} spacing={1}>
        <Grid size={1}>
          <Stack sx={{ flexGrow: 1 }} alignItems="center" gap={1}>
            <Label label="Nuyen" />
            <Typography color={nuyenBalance < 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={nuyenBalance} />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ flexGrow: 1 }} alignItems="center" gap={1}>
            <Label label="Loans" />
            <Typography color={loansBalance > 0 ? "error.main" : "text.primary"}>
              <Nuyen amount={loansBalance} />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ flexGrow: 1 }} alignItems="center" gap={1}>
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

      <Stack direction="row" alignContent="center">
        <Button
          size="small"
          variant="outlined"
          color="warning"
          fullWidth
          onClick={handleEndOfMonth}
        >
          End of Month
        </Button>
      </Stack>
    </Stack>
  )
}
