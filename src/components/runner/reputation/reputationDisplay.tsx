import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

/**
 * The full-size Street Cred / Notoriety / Public Awareness readout — originally the About
 * page's own inline markup, now shared so the Adjust Reputation dialog can show the exact same
 * display above its ledger instead of a smaller, differently-styled summary.
 */
export const ReputationDisplay: FC = () => {
  const streetCred = useRunnerSelector(ReputationSelectors.selectStreetCred)
  const notoriety = useRunnerSelector(ReputationSelectors.selectNotoriety)
  const publicAwareness = useRunnerSelector(ReputationSelectors.selectPublicAwareness)

  return (
    <Grid container columns={3} spacing={1} sx={{ margin: "auto" }}>
      <Grid size={1}>
        <Stack sx={{ alignItems: "center" }}>
          <Label label="Street Cred" />
          <Typography>{streetCred}</Typography>
        </Stack>
      </Grid>

      <Grid size={1}>
        <Stack sx={{ alignItems: "center" }}>
          <Label label="Notoriety" />
          <Typography>{notoriety}</Typography>
        </Stack>
      </Grid>

      <Grid size={1}>
        <Stack sx={{ alignItems: "center" }}>
          <Label label="Public Awareness" />
          <Typography>
            {publicAwareness.rating} - {publicAwareness.title}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}
