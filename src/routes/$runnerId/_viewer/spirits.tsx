import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SpiritList } from "#/components/runner/magician/spirits/spiritList.tsx"
import { TraditionDisplay } from "#/components/runner/magician/spirits/traditionDisplay.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/spirits")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Spirits</SectionHeader>

      <TraditionDisplay />

      <SpiritList />
    </Stack>
  )
}
