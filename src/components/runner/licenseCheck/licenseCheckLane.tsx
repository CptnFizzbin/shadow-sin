import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ItemData } from "#/system/itemData.ts"

import type { LicenseCheckChecklistChipState } from "./licenseCheckChecklistChip.tsx"
import { LicenseCheckChecklistChip } from "./licenseCheckChecklistChip.tsx"
import { LicenseCheckLaneSlot } from "./licenseCheckLaneSlot.tsx"
import type { VerificationLane, VerificationOutcome } from "./licenseCheckTypes.ts"
import { useLicenseCheckLane } from "./useLicenseCheckLane.ts"

function getChecklistChipState(
  index: number,
  currentIndex: number,
  outcomes: VerificationOutcome[],
): LicenseCheckChecklistChipState {
  if (index > currentIndex) return "queued"
  if (index === currentIndex) return "active"
  return outcomes[index]?.status ?? "clear"
}

interface LicenseCheckLaneProps {
  lane: VerificationLane
  gear: Record<string, ItemData>
  scannerRating: number
  ratingPlusRating: boolean
  onLaneComplete: (outcomes: VerificationOutcome[]) => void
}

export const LicenseCheckLane: FC<LicenseCheckLaneProps> = ({
  lane,
  gear,
  scannerRating,
  ratingPlusRating,
  onLaneComplete,
}) => {
  const { currentCheck, currentIndex, currentOutcome, outcomes, credentialDice, scannerDice } = useLicenseCheckLane({
    lane,
    scannerRating,
    ratingPlusRating,
    onLaneComplete,
  })

  return (
    <Stack sx={{ gap: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, padding: 1 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <Typography sx={{ fontWeight: "bold" }}>{lane.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {lane.checks.length}
          {" "}
          item
          {lane.checks.length === 1 ? "" : "s"}
        </Typography>
      </Stack>

      <LicenseCheckLaneSlot
        currentCheck={currentCheck}
        currentOutcome={currentOutcome}
        gear={gear}
        credentialDice={credentialDice}
        scannerDice={scannerDice}
      />

      <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
        {lane.checks.map((check, index) => (
          <LicenseCheckChecklistChip
            key={check.itemId}
            label={gear[check.itemId]?.name ?? check.itemId}
            state={getChecklistChipState(index, currentIndex, outcomes)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
