import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { AdeptPowersViewerSection } from "#/components/character/adeptPowers/adeptPowersViewerSection.tsx"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { AwakeningType } from "#/system/awakeningType.ts"

export const Route = createFileRoute("/$characterId/powers")({
  component: RouteComponent,
})

function RouteComponent() {
  const awakening = useCharacterSheet((sheet) => sheet.biology.awakening)
  const isAdept =
    awakening === AwakeningType.Adept || awakening === AwakeningType.MysticAdept

  return (
    <Stack>
      <SectionHeader>Powers</SectionHeader>

      {isAdept
        ? (
            <AdeptPowersViewerSection />
          )
        : (
            <Paper sx={{ padding: 2 }}>
              <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                This character is not an adept.
              </Typography>
            </Paper>
          )}
    </Stack>
  )
}
