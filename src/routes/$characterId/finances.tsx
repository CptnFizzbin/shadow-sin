import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"

import { CredstickSection } from "#/components/finances/credsticks/credstickSection.tsx"
import { LoansSection } from "#/components/finances/loans/loansSection.tsx"
import { NuyenSection } from "#/components/finances/nuyen/nuyenSection.tsx"
import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useNetWorth } from "../../components/finances/nuyen/useNetWorth.tsx"

export const Route = createFileRoute("/$characterId/finances")({
  component: RouteComponent,
})

function RouteComponent() {
  const nuyenStore = useNuyenStore()

  const netWorth = useNetWorth()
  const nuyenBalance = useStore(nuyenStore, (state) => state.current)
  const loansBalance = useStore(nuyenStore, (state) => state.loans.reduce((sum, loan) => sum + loan.amount, 0))

  return (
    <Stack>
      <SectionHeader>Finaces</SectionHeader>

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

      <Stack direction="row" sx={{ alignContent: "center" }}>
        <Button
          size="small"
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => nuyenStore.endOfMonth()}
        >
          End of Month
        </Button>
      </Stack>
    </Stack>
  )
}
