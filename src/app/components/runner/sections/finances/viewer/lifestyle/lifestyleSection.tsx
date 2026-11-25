import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiInfinityLine } from "@remixicon/react"
import type { FC } from "react"

import { LifestyleFields } from "#/components/runner/sections/finances/lifestyle/lifestyleFields.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { LifestyleSelectors } from "#/state/runner/lifestyle/lifestyle.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { usePrepayLifestyleDialog } from "./prepayLifestyleDialog.tsx"

export const LifestyleSection: FC = () => {
  const prepayLifestyleDialog = usePrepayLifestyleDialog()

  const upkeep = useRunnerSelector(LifestyleSelectors.selectUpkeep)
  const monthsPaid = useRunnerSelector(LifestyleSelectors.selectMonthsPaid)

  const isIncome = upkeep < 0

  return (
    <Stack>
      <Label label="Lifestyle" />

      <LifestyleFields />

      <Stack direction="row">
        <Stack sx={{ flexGrow: 1, alignItems: "center" }}>
          <Label label={isIncome ? "Monthly Income" : "Monthly Upkeep"} />
          <Typography color={isIncome ? "success.main" : "text.primary"}>
            {upkeep === 0 ? "Free" : <Nuyen amount={Math.abs(upkeep)} />}
          </Typography>
        </Stack>

        <Stack sx={{ flexGrow: 1, alignItems: "center" }}>
          <Label label="Months Prepaid" />
          <Typography>
            {upkeep > 0 ? monthsPaid : <RiInfinityLine />}
          </Typography>

          {upkeep > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => prepayLifestyleDialog.open()}
              fullWidth
            >
              Prepay
            </Button>
          )}
        </Stack>
      </Stack>

      {prepayLifestyleDialog.outlet}
    </Stack>
  )
}
