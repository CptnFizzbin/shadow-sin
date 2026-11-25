import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SpiritList } from "#/app/components/runner/awakenings/magician/viewer/spirits/spiritList.tsx"
import { TraditionDisplay } from "#/app/components/runner/awakenings/magician/viewer/spirits/traditionDisplay.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

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
