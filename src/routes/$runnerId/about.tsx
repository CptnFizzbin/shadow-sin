import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"

import { BiologySection } from "#/components/runner/biology/biologySection.tsx"
import { ExportRunnerButton } from "#/components/runner/exportImport/exportRunnerButton.tsx"
import { ImportCurrentRunnerButton } from "#/components/runner/exportImport/importCurrentRunnerButton.tsx"
import { KarmaSection } from "#/components/runner/karma/karmaSection.tsx"
import { useProfileEditDialog } from "#/components/runner/profile/profileEditDialog.tsx"
import { ProfileSection } from "#/components/runner/profile/profileSection.tsx"
import { QualitiesViewerSection } from "#/components/runner/qualities/qualitiesViewerSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const Route = createFileRoute("/$runnerId/about")({
  component: RouteComponent,
})

function RouteComponent() {
  const profileEditDialog = useProfileEditDialog()
  const profile = useRunnerStoreSelector((s) => s.profile)

  const publicAwareness = Math.max(
    0,
    Math.floor((profile.streetCred + profile.notoriety) / 3) + (profile.publicAwarenessModifier ?? 0),
  )

  return (
    <Stack>
      <IconButton
        size="small"
        onClick={() => profileEditDialog.open()}
        aria-label="Edit profile"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <RiEditLine size={16} />
      </IconButton>

      <Typography variant="h1" sx={{ textAlign: "center" }}>{profile.alias || profile.name}</Typography>

      <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
        <ExportRunnerButton />
        <ImportCurrentRunnerButton />
      </Stack>

      <SectionHeader>Profile</SectionHeader>
      <ProfileSection />
      <BiologySection />

      <Stack sx={{ gap: 1 }}>
        <Label label="Reputation" />
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <Chip label={`Street Cred: ${profile.streetCred}`} size="small" variant="outlined" sx={{ flexGrow: 1 }} />
          <Chip label={`Notoriety: ${profile.notoriety}`} size="small" variant="outlined" sx={{ flexGrow: 1 }} />
          <Chip label={`Awareness: ${publicAwareness}`} size="small" variant="outlined" sx={{ flexGrow: 1 }} />
        </Stack>
      </Stack>

      <SectionHeader>Qualities</SectionHeader>
      <QualitiesViewerSection />

      <SectionHeader>Karma</SectionHeader>
      <KarmaSection />

      {profileEditDialog.dialog}
    </Stack>
  )
}
