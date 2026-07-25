import Grid from "@mui/material/Grid"
import type { FC } from "react"
import { useCallback, useEffect, useRef, useState } from "react"

import type { ItemData } from "#/system/itemData.ts"

import { LicenseCheckLane } from "./licenseCheckLane.tsx"
import type { VerificationLane, VerificationOutcome } from "./licenseCheckTypes.ts"

interface LicenseCheckScanViewProps {
  lanes: VerificationLane[]
  gear: Record<string, ItemData>
  scannerRating: number
  ratingPlusRating: boolean
  onComplete: (outcomes: VerificationOutcome[]) => void
}

export const LicenseCheckScanView: FC<LicenseCheckScanViewProps> = ({
  lanes,
  gear,
  scannerRating,
  ratingPlusRating,
  onComplete,
}) => {
  const [outcomesByLane, setOutcomesByLane] = useState<Record<string, VerificationOutcome[]>>({})
  const hasCompletedRef = useRef(false)

  const handleLaneComplete = useCallback((laneKey: string, outcomes: VerificationOutcome[]) => {
    setOutcomesByLane((prev) => ({ ...prev, [laneKey]: outcomes }))
  }, [])

  useEffect(() => {
    if (hasCompletedRef.current) return
    if (lanes.length === 0 || Object.keys(outcomesByLane).length === lanes.length) {
      hasCompletedRef.current = true
      onComplete(Object.values(outcomesByLane).flat())
    }
  }, [lanes.length, outcomesByLane, onComplete])

  return (
    <Grid container spacing={2}>
      {lanes.map((lane) => (
        <Grid key={lane.key} size={{ xs: 12, sm: 6 }}>
          <LicenseCheckLane
            lane={lane}
            gear={gear}
            scannerRating={scannerRating}
            ratingPlusRating={ratingPlusRating}
            onLaneComplete={(outcomes) => handleLaneComplete(lane.key, outcomes)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
