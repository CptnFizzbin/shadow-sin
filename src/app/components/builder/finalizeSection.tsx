import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useEditorMode } from "#state/editor/editorMode.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

import { AllBuilderAlerts } from "./allBuilderAlerts.tsx"
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
