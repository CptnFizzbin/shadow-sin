import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useManageKarmaDialog } from "#/components/runner/karma/manage/manageKarmaDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { KarmaValue } from "./karmaValue.tsx"

export const KarmaSection: FC = () => {
  const manageKarmaDialog = useManageKarmaDialog()
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const totalKarma = useRunnerSelector(KarmaSelectors.selectTotal)

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

        <Grid size={2}>
          <Button size="small" variant="outlined" onClick={() => manageKarmaDialog.open()} fullWidth>
            Manage Karma
          </Button>
        </Grid>
      </Grid>

      {manageKarmaDialog.outlet}
    </>
  )
}
