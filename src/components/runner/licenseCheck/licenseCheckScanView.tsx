import Grid from "@mui/material/Grid"
import type { FC } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { ItemData } from "#/system/itemData.ts"

import { createVerificationQueue } from "./licenseCheckQueue.ts"
import type { VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"
import { LicenseCheckWorkerSlot } from "#/components/runner/licenseCheck/licenseCheckWorkerSlot.tsx"

const WORKER_COUNT = 4

interface LicenseCheckScanViewProps {
  checks: VerificationCheck[]
  gear: Record<string, ItemData>
  scannerRating: number
  ratingPlusRating: boolean
  onComplete: (outcomes: VerificationOutcome[]) => void
}

/** Runs the scan as a pool of workers pulling checks off one shuffled, shared queue. */
export const LicenseCheckScanView: FC<LicenseCheckScanViewProps> = ({
  checks,
  gear,
  scannerRating,
  ratingPlusRating,
  onComplete,
}) => {
  const queue = useMemo(() => createVerificationQueue(checks), [checks])
  const outcomesRef = useRef<VerificationOutcome[]>([])
  const [idleWorkers, setIdleWorkers] = useState<ReadonlySet<number>>(new Set())
  const hasCompletedRef = useRef(false)

  const handleOutcome = useCallback((outcome: VerificationOutcome) => {
    outcomesRef.current = [...outcomesRef.current, outcome]
  }, [])

  const handleIdle = useCallback((workerIndex: number) => {
    setIdleWorkers((prev) => (prev.has(workerIndex) ? prev : new Set(prev).add(workerIndex)))
  }, [])

  useEffect(() => {
    if (hasCompletedRef.current) return
    if (checks.length === 0 || idleWorkers.size === WORKER_COUNT) {
      hasCompletedRef.current = true
      onComplete(outcomesRef.current)
    }
  }, [checks.length, idleWorkers, onComplete])

  return (
    <Grid container spacing={2}>
      {Array.from({ length: WORKER_COUNT }, (_, workerIndex) => (
        <Grid key={workerIndex} size={{ xs: 12, sm: 6 }}>
          <LicenseCheckWorkerSlot
            queue={queue}
            gear={gear}
            scannerRating={scannerRating}
            ratingPlusRating={ratingPlusRating}
            onOutcome={handleOutcome}
            onIdle={() => handleIdle(workerIndex)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
