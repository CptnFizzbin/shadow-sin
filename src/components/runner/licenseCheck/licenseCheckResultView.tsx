import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useLicenseCheck } from "#/lib/contexts/runner/licenseCheckContext.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const LicenseCheckResultView: FC = () => {
  const { result } = useLicenseCheck()
  const gear = useRunnerStoreSelector(Selectors.gear.selectAllGear)

  if (!result) return null

  const hasAlerts = result.alerts.length > 0

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography color={hasAlerts ? "error.main" : "success.main"}>
        {hasAlerts ? "Question Further" : "All Clear"}
      </Typography>

      {hasAlerts && (
        <Stack sx={{ gap: 1 }}>
          {result.alerts.map((alert) => {
            if (alert.itemId === "multiple-sins") {
              return (
                <Alert key={alert.itemId} severity="error">
                  <AlertTitle>Multiple SINs Found</AlertTitle>
                  {alert.reason}
                </Alert>
              )
            }

            const licenseName = gear[alert.itemId]?.name ?? alert.itemId
            return (
              <Alert key={alert.itemId} severity="error">
                <AlertTitle>Invalid License: {licenseName}</AlertTitle>
                {alert.reason}
              </Alert>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
