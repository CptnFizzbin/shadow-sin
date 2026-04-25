import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SpiritList } from "#/components/character/spirits/SpiritList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/spirits")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ gap: 1 }}>
      <SectionHeader>Spirits</SectionHeader>

      <SpiritList />
    </Stack>
  )
}
