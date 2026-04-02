import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { AttributesSection } from "#/components/Character/attributes-section.tsx"
import { SkillsActiveView } from "#/components/Skills/skills-active-view.tsx"

export const Route = createFileRoute("/$characterId/skills")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Skills
        </Typography>
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <AttributesSection />
      </Paper>

      <Stack gap={1} sx={{ padding: 1 }}>
        <SkillsActiveView />
      </Stack>
    </Stack>
  )
}
