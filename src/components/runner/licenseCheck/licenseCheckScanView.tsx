import Grid from "@mui/material/Grid"
import type { FC } from "react"

import { useLicenseCheck } from "#/lib/contexts/runner/licenseCheckContext.tsx"

import { LicenseCheckWorkerSlot } from "./licenseCheckWorkerSlot.tsx"
import { useVerificationQueuePool } from "./useVerificationQueuePool.ts"

const WORKER_COUNT = 1

/** Runs the scan as a pool of workers pulling checks off one shuffled, shared queue. */
export const LicenseCheckScanView: FC = () => {
  const { checks, completeScan } = useLicenseCheck()
  const { queue, handleOutcome, handleWorkerIdle } = useVerificationQueuePool({
    checks,
    workerCount: WORKER_COUNT,
    onComplete: completeScan,
  })

  return (
    <Grid container spacing={2}>
      {Array.from({ length: WORKER_COUNT }, (_, workerIndex) => (
        <Grid key={workerIndex} size={{ xs: 12, sm: 6 }}>
          <LicenseCheckWorkerSlot
            queue={queue}
            onOutcome={handleOutcome}
            onIdle={() => handleWorkerIdle(workerIndex)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
