import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { VerificationQueue } from "./licenseCheckQueue.ts"
import { createVerificationQueue } from "./licenseCheckQueue.ts"
import type { VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"

interface UseVerificationQueuePoolArgs {
  checks: VerificationCheck[]
  workerCount: number
  onComplete: (outcomes: VerificationOutcome[]) => void
}

interface UseVerificationQueuePoolResult {
  queue: VerificationQueue
  handleOutcome: (outcome: VerificationOutcome) => void
  handleWorkerIdle: (workerIndex: number) => void
}

/**
 * Coordinates a fixed-size worker pool pulling from one shared `VerificationQueue`: collects
 * outcomes as workers report them and fires `onComplete` once every worker has gone idle — or
 * immediately when there's nothing to scan.
 */
export function useVerificationQueuePool({
  checks,
  workerCount,
  onComplete,
}: UseVerificationQueuePoolArgs): UseVerificationQueuePoolResult {
  const queue = useMemo(() => createVerificationQueue(checks), [checks])
  const outcomesRef = useRef<VerificationOutcome[]>([])
  const [idleWorkers, setIdleWorkers] = useState<ReadonlySet<number>>(new Set())
  const hasCompletedRef = useRef(false)

  const handleOutcome = useCallback((outcome: VerificationOutcome) => {
    outcomesRef.current = [...outcomesRef.current, outcome]
  }, [])

  const handleWorkerIdle = useCallback((workerIndex: number) => {
    setIdleWorkers((prev) => (prev.has(workerIndex) ? prev : new Set(prev).add(workerIndex)))
  }, [])

  useEffect(() => {
    if (hasCompletedRef.current) return
    if (checks.length === 0 || idleWorkers.size === workerCount) {
      hasCompletedRef.current = true
      onComplete(outcomesRef.current)
    }
  }, [checks.length, idleWorkers, workerCount, onComplete])

  return { queue, handleOutcome, handleWorkerIdle }
}
