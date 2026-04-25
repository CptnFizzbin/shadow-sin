import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { AddKarmaDialog } from "#/components/character/karma/addKarmaDialog.tsx"
import { selectCurrentKarma, selectTotalKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Label } from "#/components/ui/text/label"

export const KarmaSection: FC = () => {
  const dialogApi = useDialogApi()
  const karmaStore = useKarmaStore()
  const currentKarma = useStore(karmaStore, selectCurrentKarma)
  const totalKarma = useStore(karmaStore, selectTotalKarma)

  const handleOpenAddKarma = () => {
    dialogApi.open<void>((props) => (
      <AddKarmaDialog {...props} onSubmit={(amount) => karmaStore.addKarma(amount)} />
    ))
  }

  return (
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
        <Button size="small" variant="outlined" disabled fullWidth>
          Spend Karma
        </Button>
      </Grid>
    </Grid>
  )
}
