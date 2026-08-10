import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { GmToolList } from "#/components/landing/gmToolList.tsx"
import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"

export const Route = createFileRoute("/gm/")({
  component: GmScreenRoute,
})

function GmScreenRoute() {
  return (
    <Stack sx={{ gap: 1 }}>
      <LandingModeSwitch />

      <Stack sx={{ paddingX: 1 }}>
        <GmToolList />
      </Stack>
    </Stack>
  )
}
