import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { ExtendedTestsSection } from "#/app/components/runner/sections/notes/extendedTests/extendedTestsSection.tsx"
import { NotesTextSection } from "#/app/components/runner/sections/notes/freeform/notesTextSection.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/notes")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Notes</SectionHeader>

      <NotesTextSection />

      <ExtendedTestsSection />
    </Stack>
  )
}
