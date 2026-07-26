import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ItemData } from "#/system/itemData.ts"

import type { LicenseCheckResult } from "./licenseCheckTypes.ts"

interface LicenseCheckResultViewProps {
  result: LicenseCheckResult
  gear: Record<string, ItemData>
}

export const LicenseCheckResultView: FC<LicenseCheckResultViewProps> = ({ result, gear }) => {
  const hasAlerts = result.alerts.length > 0

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6" color={hasAlerts ? "error.main" : "success.main"}>
        {hasAlerts ? "Question Further" : "All Clear"}
      </Typography>

      {hasAlerts && (
        <Stack sx={{ gap: 1 }}>
          {result.alerts.map((alert) => {
            const name = alert.itemId === "multiple-sins"
              ? "Multiple SINs"
              : (gear[alert.itemId]?.name ?? alert.itemId)

            return (
              <Stack
                key={alert.itemId}
                direction={{ xs: "column", sm: "row" }}
                sx={{ justifyContent: "space-between", gap: { xs: 0, sm: 1 } }}
              >
                <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
                <Typography color="text.secondary">{alert.reason}</Typography>
              </Stack>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
