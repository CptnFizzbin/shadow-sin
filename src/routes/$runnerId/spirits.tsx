import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SpiritList } from "#/components/runner/spirits/spiritList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/spirits")({
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
