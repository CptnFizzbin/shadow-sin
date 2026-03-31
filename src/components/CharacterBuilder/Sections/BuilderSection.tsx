import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC, PropsWithChildren, ReactNode } from "react"

import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"
import { AlertsList } from "#/components/UI/Alerts/AlertsList.tsx"

interface BuilderSectionProps extends PropsWithChildren {
  title: ReactNode
  alerts?: AlertInfo[]
}

export const BuilderSection: FC<BuilderSectionProps> = ({
  title,
  children,
  alerts = [],
}) => {
  let borderColor: string | undefined = undefined

  const activeAlerts = alerts.filter((alert) => !alert.summaryOnly)

  const hasWarnings = activeAlerts.some((alert) => alert.severity === "warning")
  if (hasWarnings) borderColor = "warning.main"

  const hasErrors = activeAlerts.some((alert) => alert.severity === "error")
  if (hasErrors) borderColor = "error.main"

  return (
    <Paper sx={{ padding: 1, borderColor }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {title}
        </Typography>

        <AlertsList alerts={alerts} />

        {children}
      </Stack>
    </Paper>
  )
}
