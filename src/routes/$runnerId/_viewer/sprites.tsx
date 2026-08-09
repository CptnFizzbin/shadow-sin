import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SpriteList } from "#/components/runner/technomancer/sprites/spriteList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/sprites")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ gap: 1 }}>
      <SectionHeader>Sprites</SectionHeader>

      <SpriteList />
    </Stack>
  )
}
