import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { BiologySection } from "#/components/character/biologySection.tsx"
import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { ProfileEditDialog } from "#/components/character/profileEditDialog.tsx"
import { ProfileSection } from "#/components/character/profileSection.tsx"
import { QualitiesViewerSection } from "#/components/qualities/qualitiesViewerSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/about")({
  component: RouteComponent,
})

type ProfileEditDialogState = null | { open: boolean }

function RouteComponent() {
  const [profileEditDialog, setProfileEditDialog] = useState<ProfileEditDialogState>(null)
  const profile = useCharacterSheet((s) => s.profile)

  const publicAwareness = Math.max(
    0,
    Math.floor((profile.streetCred + profile.notoriety) / 3) + (profile.publicAwarenessModifier ?? 0),
  )

  return (
    <Stack>
      <IconButton
        size="small"
        onClick={() => setProfileEditDialog({ open: true })}
        aria-label="Edit profile"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <RiEditLine size={16} />
      </IconButton>

      <Typography variant="h1" sx={{ textAlign: "center" }}>{profile.alias || profile.name}</Typography>

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

      {profileEditDialog !== null && (
        <ProfileEditDialog
          open={profileEditDialog.open}
          onClose={() => setProfileEditDialog((prev) => prev && { ...prev, open: false })}
          onClosed={() => setProfileEditDialog(null)}
        />
      )}
    </Stack>
  )
}
