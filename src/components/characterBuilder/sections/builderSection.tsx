import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import type { FC, PropsWithChildren } from "react"

import type { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { builderSections } from "#/components/characterBuilder/sections/builderSectionId.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { AlertsList } from "#/components/ui/alerts/alertsList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

interface BuilderSectionProps extends PropsWithChildren {
  id: BuilderSectionId
  alerts?: AlertInfo[]
}

export const BuilderSection: FC<BuilderSectionProps> = ({
  id,
  children,
  alerts = [],
}) => {
  const title = builderSections[id].label
  let borderColor: string | undefined = undefined

  const activeAlerts = alerts.filter((alert) => !alert.summaryOnly)

  const hasWarnings = activeAlerts.some((alert) => alert.severity === "warning")
  if (hasWarnings) borderColor = "warning.main"

  const hasErrors = activeAlerts.some((alert) => alert.severity === "error")
  if (hasErrors) borderColor = "error.main"

  return (
    <Paper sx={{ padding: 1, borderColor }} id={id}>
      <Stack gap={1}>
        <SectionHeader>{title}</SectionHeader>
        <AlertsList alerts={alerts} />

        {children}
      </Stack>
    </Paper>
  )
}
