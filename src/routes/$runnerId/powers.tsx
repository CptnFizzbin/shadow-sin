import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"

import { AdeptPowersViewerSection } from "#/components/runner/adeptPowers/adeptPowersViewerSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

interface Props {}

const RouteComponent: FC<Props> = () => {
  const awakening = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
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
                This runner is not an adept.
              </Typography>
            </Paper>
          )}
    </Stack>
  )
}

export const Route = createFileRoute("/$runnerId/powers")({
  component: RouteComponent,
})
