import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"

import { BiologySection } from "#/components/runner/biology/biologySection.tsx"
import { ExportRunnerButton } from "#/components/runner/exportImport/exportRunnerButton.tsx"
import { ImportCurrentRunnerButton } from "#/components/runner/exportImport/importCurrentRunnerButton.tsx"
import { KarmaSection } from "#/components/runner/karma/karmaSection.tsx"
import { BackupReminderNotice } from "#/components/runner/profile/backupReminderNotice.tsx"
import { useProfileEditDialog } from "#/components/runner/profile/profileEditDialog.tsx"
import { ProfileSection } from "#/components/runner/profile/profileSection.tsx"
import { QualitiesViewerSection } from "#/components/runner/qualities/qualitiesViewerSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const Route = createFileRoute("/$runnerId/_viewer/about")({
  component: RouteComponent,
})

function RouteComponent() {
  const profileEditDialog = useProfileEditDialog()
  const profile = useRunnerSelector(ProfileSelectors.select)
  const streetCred = useRunnerSelector(ReputationSelectors.selectStreetCred)
  const notoriety = useRunnerSelector(ReputationSelectors.selectNotoriety)
  const publicAwareness = useRunnerSelector(ReputationSelectors.selectPublicAwareness)

  return (
    <Stack sx={{ position: "relative" }}>
      <IconButton
        size="small"
        onClick={() => profileEditDialog.open()}
        aria-label="Edit profile"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <RiEditLine size={16} />
      </IconButton>

      <Typography variant="h1" sx={{ textAlign: "center" }}>{profile.alias || profile.name}</Typography>

      <BackupReminderNotice />

      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <ExportRunnerButton />
        <ImportCurrentRunnerButton />
      </Stack>

      <SectionHeader>Profile</SectionHeader>
      <ProfileSection />
      <BiologySection />

      <SectionHeader>Qualities</SectionHeader>
      <QualitiesViewerSection />

      <Grid container columns={{ xs: 1, md: 2 }} spacing={2}>
        <Grid size={1}>
          <SectionHeader>Karma</SectionHeader>

          <KarmaSection />
        </Grid>

        <Grid size={1}>
          <SectionHeader>Reputation</SectionHeader>

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

            <Grid size={3}>
              <Button disabled variant="outlined" fullWidth>Adjust Reputation</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {profileEditDialog.outlet}
    </Stack>
  )
}
