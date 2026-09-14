import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { ExtendedTestsSection } from "#/components/notes/extendedTests/extendedTestsSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/notes")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Notes</SectionHeader>

      <ExtendedTestsSection />
    </Stack>
  )
}
