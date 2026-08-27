import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { KarmaSelectors } from "#/stores/runner/karma/karmaSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { useAddKarmaDialog } from "./addKarmaDialog.tsx"
import { KarmaValue } from "./karmaValue.tsx"
import { useSpendKarmaDialog } from "./spendKarmaDialog.tsx"

export const KarmaSection: FC = () => {
  const addKarmaDialog = useAddKarmaDialog()
  const spendKarmaDialog = useSpendKarmaDialog()
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const totalKarma = useRunnerSelector(KarmaSelectors.selectTotal)

  const handleOpenAddKarma = () => {
    addKarmaDialog.open()
  }

  const handleOpenSpendKarma = () => {
    spendKarmaDialog.open()
  }

  return (
    <>
      <Grid container columns={2} spacing={1} sx={{ margin: "auto" }}>
        <Grid size={1}>
          <Stack sx={{ alignItems: "center" }}>
            <Label label="Current" />
            <KarmaValue amount={currentKarma} sx={{ fontWeight: "bold" }} />
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ alignItems: "center" }}>
            <Label label="Total Earned" />
            <KarmaValue amount={totalKarma} sx={{ fontWeight: "bold" }} />
          </Stack>
        </Grid>

        <Grid size={1}>
          <Button size="small" variant="outlined" onClick={handleOpenAddKarma} fullWidth>
            Add Karma
          </Button>
        </Grid>

        <Grid size={1}>
          <Button size="small" variant="outlined" onClick={handleOpenSpendKarma} fullWidth>
            Spend Karma
          </Button>
        </Grid>
      </Grid>

      {addKarmaDialog.dialog}
      {spendKarmaDialog.dialog}
    </>
  )
}
