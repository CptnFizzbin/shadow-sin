import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { CredstickSection } from "#/components/finances/credsticks/credstickSection.tsx"
import { LoansSection } from "#/components/finances/loans/loansSection.tsx"
import { NuyenSection } from "#/components/finances/nuyen/nuyenSection.tsx"
import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { useGearFilter } from "#/components/gear/useGearApi.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { isCredstickData } from "#/lib/system/gear/credstickData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

function useNetWorth(): number {
  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const loans = useCharacterSheet((s) => s.nuyen.loans)
  const allGear = useGearFilter((_item): _item is ItemData => true)

  const credstickTotal = allGear
    .filter(isCredstickData)
    .reduce((sum, credstick) => sum + credstick.balance, 0)

  const gearTotal = allGear
    .filter((item) => !isCredstickData(item))
    .reduce((sum, item) => sum + (item.cost ?? 0) * (item.quantity ?? 1), 0)

  const loansTotal = loans.reduce((sum, loan) => sum + loan.amount, 0)

  return currentNuyen + gearTotal + credstickTotal - loansTotal
}

export const FinancesPage: FC = () => {
  const nuyenStore = useNuyenStore()

  const netWorth = useNetWorth()
  const nuyenBalance = useStore(nuyenStore, (state) => state.current)
  const loansBalance = useStore(nuyenStore, (state) => state.loans.reduce((sum, loan) => sum + loan.amount, 0))

  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
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
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <NuyenSection />
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <CredstickSection />
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <LoansSection />
      </Paper>

      <Stack direction="row" alignContent="center">
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
