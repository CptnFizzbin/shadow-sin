import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ItemData } from "#/system/itemData.ts"

import type { VerificationQueue } from "./licenseCheckQueue.ts"
import type { VerificationOutcome } from "./licenseCheckTypes.ts"
import { LicenseCheckWorkerSlot } from "./licenseCheckWorkerSlot.tsx"
import { useLicenseCheckWorker } from "./useLicenseCheckWorker.ts"

interface LicenseCheckWorkerProps {
  label: string
  queue: VerificationQueue
  gear: Record<string, ItemData>
  scannerRating: number
  ratingPlusRating: boolean
  onOutcome: (outcome: VerificationOutcome) => void
  onIdle: () => void
}

export const LicenseCheckWorker: FC<LicenseCheckWorkerProps> = ({
  label,
  queue,
  gear,
  scannerRating,
  ratingPlusRating,
  onOutcome,
  onIdle,
}) => {
  const { currentCheck, currentOutcome, credentialDice, scannerDice } = useLicenseCheckWorker({
    queue,
    scannerRating,
    ratingPlusRating,
    onOutcome,
    onIdle,
  })

  return (
    <Stack sx={{ gap: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, padding: 1 }}>
      <Typography sx={{ fontWeight: "bold" }}>{label}</Typography>

      <LicenseCheckWorkerSlot
        currentCheck={currentCheck ?? undefined}
        currentOutcome={currentOutcome}
        gear={gear}
        credentialDice={credentialDice}
        scannerDice={scannerDice}
      />
    </Stack>
  )
}
