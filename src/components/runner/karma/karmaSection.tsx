import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { useAddKarmaDialog } from "./addKarmaDialog.tsx"
import { useSpendKarmaDialog } from "./spendKarmaDialog.tsx"

export const KarmaSection: FC = () => {
  const addKarmaDialog = useAddKarmaDialog()
  const spendKarmaDialog = useSpendKarmaDialog()
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const totalKarma = useRunnerStoreSelector(Selectors.karma.selectTotalKarma)

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
          <Stack sx={{ gap: 1, alignItems: "center" }}>
            <Label label="Current" />
            <Typography sx={{ fontWeight: "bold" }}>
              {currentKarma}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ gap: 1, alignItems: "center" }}>
            <Label label="Total Earned" />
            <Typography sx={{ fontWeight: "bold" }}>
              {totalKarma}
            </Typography>
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
