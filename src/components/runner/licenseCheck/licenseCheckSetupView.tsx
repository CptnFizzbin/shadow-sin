import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"
import { useMemo } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { ItemData } from "#/system/itemData.ts"

import { LicenseCheckChecklistRow } from "./licenseCheckChecklistRow.tsx"
import { buildVerificationLanes } from "./licenseCheckLanes.ts"

interface LicenseCheckSetupViewProps {
  gear: Record<string, ItemData>
  scannerRating: number
  onScannerRatingChange: (rating: number) => void
}

const ratingOptions = [1, 2, 3, 4, 5, 6]

export const LicenseCheckSetupView: FC<LicenseCheckSetupViewProps> = ({
  gear,
  scannerRating,
  onScannerRatingChange,
}) => {
  // Display-only — the scan itself always builds fresh, stash-excluded lanes at Start Scan time.
  const lanes = useMemo(
    () => buildVerificationLanes(gear),
    [gear],
  )

  const sinLanes = lanes.filter((lane) => lane.checks[0]?.kind === "sin")
  const unlicensedLane = lanes.find((lane) => lane.key === "unlicensed")
  const forbiddenLane = lanes.find((lane) => lane.key === "forbidden")

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <Label>Verification System Rating</Label>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={scannerRating}
          onChange={(_, value: number | null) => {
            if (value !== null) onScannerRatingChange(value)
          }}
        >
          {ratingOptions.map((rating) => (
            <ToggleButton key={rating} value={rating} sx={{ px: 1.5, flexGrow: 1 }}>
              {rating}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {sinLanes.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          <Label>Licensed Gear</Label>
          {sinLanes.map((lane) => {
            const [sinCheck, ...gearChecks] = lane.checks

            return (
              <Stack key={lane.key} sx={{ gap: 0.5, border: "1px solid", borderColor: "divider", padding: 1 }}>
                <LicenseCheckChecklistRow item={gear[sinCheck.itemId]} check={sinCheck} showStashToggle={false} />

                {gearChecks.length > 0 && (
                  <Stack
                    sx={{
                      gap: 0.5,
                      paddingLeft: 1,
                      borderLeft: "2px solid",
                      borderColor: "divider",
                      bgcolor: "action.hover",
                      borderRadius: 1,
                      paddingY: 0.5,
                    }}
                  >
                    {gearChecks.map((check) => (
                      <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
                    ))}
                  </Stack>
                )}
              </Stack>
            )
          })}
        </Stack>
      )}

      {unlicensedLane && (
        <Stack sx={{ gap: 0.5 }}>
          <Label>Unlicensed Gear</Label>

          <Alert variant="outlined" severity="warning">
            <AlertTitle>Unlicensed items detected</AlertTitle>
            These items will be questioned by officials. A good reason will needed.
          </Alert>

          <Stack
            sx={{
              gap: 0.5,
              paddingLeft: 1,
              borderLeft: "2px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              borderRadius: 1,
              paddingY: 0.5,
            }}
          >
            {unlicensedLane.checks.map((check) => (
              <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
            ))}
          </Stack>
        </Stack>
      )}

      {forbiddenLane && (
        <Stack sx={{ gap: 0.5 }}>
          <Label>Forbidden Gear</Label>

          <Alert variant="outlined" severity="error">
            <AlertTitle>Forbidden items detected</AlertTitle>
            These items will be questioned by officials. You better have a <em>really</em> good story for them.
          </Alert>

          <Stack
            sx={{
              gap: 0.5,
              paddingLeft: 1,
              borderLeft: "2px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              borderRadius: 1,
              paddingY: 0.5,
            }}
          >
            {forbiddenLane.checks.map((check) => (
              <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
