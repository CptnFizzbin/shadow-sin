import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { useAddKarmaDialog } from "./addKarmaDialog.tsx"
import { KarmaValue } from "./karmaValue.tsx"
import { useSpendKarmaDialog } from "./spendKarmaDialog.tsx"

export const KarmaSection: FC = () => {
  const addKarmaDialog = useAddKarmaDialog()
  const spendKarmaDialog = useSpendKarmaDialog()
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const totalKarma = useRunnerStoreSelector(Selectors.karma.selectTotalKarma)
  const streetCred = useRunnerStoreSelector(Selectors.profile.selectStreetCred)
  const notoriety = useRunnerStoreSelector(Selectors.profile.selectNotoriety)
  const publicAwareness = useRunnerStoreSelector(Selectors.profile.selectPublicAwareness)

  const handleOpenAddKarma = () => {
    addKarmaDialog.open()
  }

  const handleOpenSpendKarma = () => {
    spendKarmaDialog.open()
  }

  return (
    <>
      <Grid container columns={4} spacing={1} sx={{ margin: "auto" }}>
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
          <Stack sx={{ alignItems: "center" }}>
            <Label label="Street Cred" />
            <Typography sx={{ fontWeight: "bold" }}>{streetCred}</Typography>
          </Stack>
        </Grid>

        <Grid size={1}>
          <Stack sx={{ alignItems: "center" }}>
            <Label label="Notoriety" />
            <Typography sx={{ fontWeight: "bold" }}>{notoriety}</Typography>
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

        <Grid size={2}>
          <Stack sx={{ alignItems: "center" }}>
            <Label label="Public Awareness" />
            <Typography sx={{ fontWeight: "bold" }}>{publicAwareness}</Typography>
          </Stack>
        </Grid>
      </Grid>

      {addKarmaDialog.dialog}
      {spendKarmaDialog.dialog}
    </>
  )
}
