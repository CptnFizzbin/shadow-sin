import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"

import { BiologySection } from "#/components/biology/viewer/biologySection.tsx"
import { ExportRunnerButton } from "#/components/exportImport/exportRunnerButton.tsx"
import { ImportCurrentRunnerButton } from "#/components/exportImport/importCurrentRunnerButton.tsx"
import { KarmaSection } from "#/components/karma/viewer/karmaSection.tsx"
import { BackupReminderNotice } from "#/components/profile/viewer/backupReminderNotice.tsx"
import { useProfileEditDialog } from "#/components/profile/viewer/profileEditDialog.tsx"
import { ProfileSection } from "#/components/profile/viewer/profileSection.tsx"
import { QualitiesViewerSection } from "#/components/qualities/viewer/qualitiesViewerSection.tsx"
import { ReputationSection } from "#/components/reputation/reputationSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const Route = createFileRoute("/$runnerId/_viewer/about")({
  component: RouteComponent,
})

function RouteComponent() {
  const profileEditDialog = useProfileEditDialog()
  const profile = useRunnerSelector(ProfileSelectors.select)

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

          <ReputationSection />
        </Grid>
      </Grid>

      {profileEditDialog.outlet}
    </Stack>
  )
}
