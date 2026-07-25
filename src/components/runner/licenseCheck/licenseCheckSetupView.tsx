import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useMemo, useState } from "react"

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
  const [showAllItems, setShowAllItems] = useState(false)

  // Display-only — the scan itself always builds fresh, stash-excluded lanes at Start Scan time.
  const lanes = useMemo(
    () => buildVerificationLanes(gear, { includeStashed: showAllItems }),
    [gear, showAllItems],
  )

  const sinLanes = lanes.filter((lane) => lane.checks[0]?.kind === "sin")
  const unlicensedLane = lanes.find((lane) => lane.key === "unlicensed")
  const forbiddenLane = lanes.find((lane) => lane.key === "forbidden")

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle2">Verification System Rating</Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={scannerRating}
          onChange={(_, value: number | null) => {
            if (value !== null) onScannerRatingChange(value)
          }}
        >
          {ratingOptions.map((rating) => (
            <ToggleButton key={rating} value={rating} sx={{ px: 1.5 }}>
              {rating}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <FormControlLabel
        label="Show all items"
        sx={{ alignSelf: "flex-start" }}
        control={(
          <Switch
            size="small"
            checked={showAllItems}
            onChange={(e) => setShowAllItems(e.target.checked)}
          />
        )}
      />

      {sinLanes.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          <Typography variant="subtitle2">SINs</Typography>
          {sinLanes.map((lane) => {
            const [sinCheck, ...gearChecks] = lane.checks
            return (
              <Stack key={lane.key} sx={{ gap: 0.5 }}>
                <LicenseCheckChecklistRow item={gear[sinCheck.itemId]} check={sinCheck} showStashToggle={false} />
                {gearChecks.length > 0 && (
                  <Stack
                    sx={{
                      gap: 0.5,
                      marginLeft: 3,
                      paddingLeft: 1,
                      borderLeft: "2px solid",
                      borderColor: "divider",
                      bgcolor: "action.hover",
                      borderRadius: 1,
                      paddingY: 0.5,
                    }}
                  >
                    {gearChecks.map((check) => (
                      <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} nested />
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
          <Typography variant="subtitle2">Unlicensed Gear</Typography>
          {unlicensedLane.checks.map((check) => (
            <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
          ))}
        </Stack>
      )}

      {forbiddenLane && (
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle2">Forbidden Gear</Typography>
          {forbiddenLane.checks.map((check) => (
            <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
