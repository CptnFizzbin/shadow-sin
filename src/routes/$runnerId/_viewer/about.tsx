import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"

import { KarmaSection } from "#/components/runner/karma/viewer/karmaSection.tsx"
import { BiologySection } from "#/components/runner/sections/biology/viewer/biologySection.tsx"
import { BackupReminderNotice } from "#/components/runner/sections/profile/viewer/backupReminderNotice.tsx"
import { useProfileEditDialog } from "#/components/runner/sections/profile/viewer/profileEditDialog.tsx"
import { ProfileSection } from "#/components/runner/sections/profile/viewer/profileSection.tsx"
import { QualitiesViewerSection } from "#/components/runner/sections/qualities/viewer/qualitiesViewerSection.tsx"
import { ReputationSection } from "#/components/runner/sections/reputation/reputationSection.tsx"
import { ExportRunnerButton } from "#/components/system/exportImport/exportRunnerButton.tsx"
import { ImportCurrentRunnerButton } from "#/components/system/exportImport/importCurrentRunnerButton.tsx"
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
