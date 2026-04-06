import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { CredstickSection } from "#/components/finances/credstickSection.tsx"
import { LoansSection } from "#/components/finances/loansSection.tsx"
import { NuyenSection } from "#/components/finances/nuyenSection.tsx"
import { useNuyenStore } from "#/components/finances/useNuyenStore.ts"
import { useGearFilter } from "#/components/gear/useGearApi.ts"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
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

  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack gap={0.25}>
            <Typography variant="caption" color="text.secondary">
              Net Worth
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={netWorth < 0 ? "error.main" : "text.primary"}
            >
              {formatNuyen(netWorth)}
            </Typography>
          </Stack>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => nuyenStore.endOfMonth()}
          >
            End of Month
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <NuyenSection />
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <Stack gap={1} divider={<Divider />}>
          <CredstickSection />
          <LoansSection />
        </Stack>
      </Paper>
    </Stack>
  )
}
