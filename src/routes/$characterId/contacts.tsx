import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { ContactsSection } from "#/components/Character/contacts-section.tsx"

export const Route = createFileRoute("/$characterId/contacts")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <Typography variant="h6">Contacts</Typography>
      </Paper>
      <Paper sx={{ padding: 1 }}>
        <ContactsSection />
      </Paper>
    </Stack>
  )
}
