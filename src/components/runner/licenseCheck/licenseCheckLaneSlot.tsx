import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { DieState } from "#/system/dice/dieState.ts"
import type { ItemData } from "#/system/itemData.ts"

import { LicenseCheckDiceGroup } from "./licenseCheckDiceGroup.tsx"
import type { VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"

const kindLabel: Record<VerificationCheck["kind"], string> = {
  "sin": "SIN",
  "licensed-gear": "Licensed",
  "unlicensed-gear": "Unlicensed",
  "forbidden-gear": "Forbidden",
}

function getSlotBorderColor(currentOutcome: VerificationOutcome | null): string {
  if (!currentOutcome) return "divider"
  return currentOutcome.status === "clear" ? "success.main" : "error.main"
}

function getOutcomeColor(currentOutcome: VerificationOutcome | null): string {
  if (!currentOutcome) return "text.secondary"
  return currentOutcome.status === "clear" ? "success.main" : "error.main"
}

function getOutcomeLabel(currentOutcome: VerificationOutcome | null): string {
  if (!currentOutcome) return "Scanning…"
  return currentOutcome.status === "clear" ? "Clear" : "Flagged"
}

interface LicenseCheckLaneSlotProps {
  currentCheck: VerificationCheck | undefined
  currentOutcome: VerificationOutcome | null
  gear: Record<string, ItemData>
  credentialDice: DieState[]
  scannerDice: DieState[]
}

/** The single active/settled check slot within a lane: item name, dice, and the clear/flagged status. */
export const LicenseCheckLaneSlot: FC<LicenseCheckLaneSlotProps> = ({
  currentCheck,
  currentOutcome,
  gear,
  credentialDice,
  scannerDice,
}) => {
  return (
    <Stack
      sx={{
        gap: 0.5,
        border: "1px dashed",
        borderColor: getSlotBorderColor(currentOutcome),
        borderRadius: 1,
        padding: 1,
        minHeight: 72,
        justifyContent: "center",
      }}
    >
      {currentCheck
        ? (
            <>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }} noWrap>
                  {gear[currentCheck.itemId]?.name ?? currentCheck.itemId}
                </Typography>
                <Typography variant="caption" color="text.secondary">{kindLabel[currentCheck.kind]}</Typography>
              </Stack>

              <LicenseCheckDiceGroup label="You" dice={credentialDice} />
              <LicenseCheckDiceGroup label="Scanner" dice={scannerDice} />

              <Typography variant="caption" color={getOutcomeColor(currentOutcome)}>
                {getOutcomeLabel(currentOutcome)}
              </Typography>
            </>
          )
        : (
            <Typography variant="body2" color="success.main">Done</Typography>
          )}
    </Stack>
  )
}
