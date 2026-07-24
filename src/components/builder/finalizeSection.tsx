import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

import { AllBuilderAlerts } from "./alerts/allBuilderAlerts.tsx"
import { SaveRunnerButton } from "./saveRunnerButton.tsx"

export const FinalizeSection: FC = () => {
  return (
    <Stack sx={{ gap: 1 }}>
      <SectionHeader>Finalize</SectionHeader>
      <AllBuilderAlerts />
      <SaveRunnerButton requireValid={false} />
    </Stack>
  )
}
