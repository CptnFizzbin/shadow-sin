import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useLicenseCheck } from "#/lib/contexts/runner/licenseCheckContext.tsx"
import { useLicenseCheckWorker } from "#/lib/hooks/runner/licenseCheck/useLicenseCheckWorker.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

import { LicenseCheckDiceGroup } from "./licenseCheckDiceGroup.tsx"
import type { VerificationQueue } from "./licenseCheckQueue.ts"
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

interface LicenseCheckWorkerSlotProps {
  queue: VerificationQueue
  onOutcome: (outcome: VerificationOutcome) => void
  onIdle: () => void
}

/** The single active/settled check slot within a worker: item name, dice, and the clear/flagged status. */
export const LicenseCheckWorkerSlot: FC<LicenseCheckWorkerSlotProps> = ({
  queue,
  onOutcome,
  onIdle,
}) => {
  const { scannerRating } = useLicenseCheck()
  const gear = useRunnerStoreSelector(Selectors.gear.selectGear)
  const ratingPlusRating = useRunnerStoreSelector(
    Selectors.houseRules.select("items.licenseCheck.ratingPlusRating"),
  )

  const { currentCheck, currentOutcome, credentialDice, scannerDice } = useLicenseCheckWorker({
    queue,
    scannerRating,
    ratingPlusRating,
    onOutcome,
    onIdle,
  })

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

              {currentCheck.kind !== "forbidden-gear" && currentCheck.kind !== "unlicensed-gear" && (
                <>
                  <LicenseCheckDiceGroup label="You" dice={credentialDice} />
                  <LicenseCheckDiceGroup label="Scanner" dice={scannerDice} />
                </>
              )}

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
