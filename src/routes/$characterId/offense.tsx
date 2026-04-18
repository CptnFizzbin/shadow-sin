import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { InitiativeSection } from "../../components/initiative/initiativeSection.tsx"
import { EquippedWeaponsSection } from "../../components/weapons/equippedWeaponsSection.tsx"

export const Route = createFileRoute("/$characterId/offense")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Offense</SectionHeader>

      <InitiativeSection />
      <Divider />
      <EquippedWeaponsSection />
    </Stack>
  )
}
