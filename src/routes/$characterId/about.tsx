import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiEditLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { AttributesSection } from "#/components/Attributes/attributes-section.tsx"
import { BiologySection } from "#/components/Character/biology-section.tsx"
import { FinancesSection } from "#/components/Character/finances-section.tsx"
import { ProfileEditDialog } from "#/components/Character/profile-edit-dialog.tsx"
import { ProfileSection } from "#/components/Character/profile-section.tsx"
import { SinsAndLicensesSection } from "#/components/Character/sins-and-licenses-section.tsx"

export const Route = createFileRoute("/$characterId/about")({
  component: RouteComponent,
})

type ProfileEditDialogState = null | { open: boolean }

function RouteComponent() {
  const [profileEditDialog, setProfileEditDialog] = useState<ProfileEditDialogState>(null)

  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <Stack gap={1.5} divider={<Divider />}>
          <Stack direction="row" alignItems="flex-start" gap={1}>
            <Box sx={{ flexGrow: 1 }}>
              <ProfileSection />
            </Box>
            <IconButton
              size="small"
              onClick={() => setProfileEditDialog({ open: true })}
              aria-label="Edit profile"
            >
              <RiEditLine size={16} />
            </IconButton>
          </Stack>
          <BiologySection />
          <SinsAndLicensesSection />
        </Stack>
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <FinancesSection />
      </Paper>

      <AttributesSection />

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
