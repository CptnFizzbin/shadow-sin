import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { useEditorMode } from "#/contexts/builder/editorMode.tsx"

import { AllBuilderAlerts } from "#/components/alerts/allBuilderAlerts.tsx"
import { SaveRunnerButton } from "./saveRunnerButton.tsx"

export const FinalizeSection: FC = () => {
  // Character creation enforces build-point validity; editing an existing runner should not be
  // blocked by build-point budget errors that only make sense at creation time — see
  // SaveRunnerButtonProps.requireValid.
  const { isBuilder } = useEditorMode()

  return (
    <Stack>
      <SectionHeader>Finalize</SectionHeader>
      <AllBuilderAlerts />
      <SaveRunnerButton requireValid={isBuilder} />
    </Stack>
  )
}
