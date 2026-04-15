import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { BiologySection } from "#/components/character/biologySection.tsx"
import { FinancesSection } from "#/components/character/financesSection.tsx"
import { ProfileEditDialog } from "#/components/character/profileEditDialog.tsx"
import { ProfileSection } from "#/components/character/profileSection.tsx"
import { SinsAndLicensesSection } from "#/components/licenses/sinsAndLicensesSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/about")({
  component: RouteComponent,
})

type ProfileEditDialogState = null | { open: boolean }

function RouteComponent() {
  const [profileEditDialog, setProfileEditDialog] = useState<ProfileEditDialogState>(null)

  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1, position: "relative" }}>
        <IconButton
          size="small"
          onClick={() => setProfileEditDialog({ open: true })}
          aria-label="Edit profile"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <RiEditLine size={16} />
        </IconButton>

        <Stack divider={<Divider />}>
          <ProfileSection />
          <BiologySection />
        </Stack>
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <FinancesSection />
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <Stack gap={1}>
          <SectionHeader>SINs & Licenses</SectionHeader>
          <SinsAndLicensesSection />
        </Stack>
      </Paper>

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
