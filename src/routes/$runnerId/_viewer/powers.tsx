import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"

import { AdeptPowersViewerSection } from "#/components/adeptPowers/viewer/adeptPowersViewerSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AwakeningType } from "#/system/model/magic/awakeningType.ts"

interface Props {}

const RouteComponent: FC<Props> = () => {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
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

export const Route = createFileRoute("/$runnerId/_viewer/powers")({
  component: RouteComponent,
})
