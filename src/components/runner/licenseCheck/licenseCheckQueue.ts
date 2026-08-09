import type { VerificationCheck } from "./licenseCheckTypes.ts"

export interface VerificationQueue {
  next: () => VerificationCheck | undefined
}

/**
 * A shared, mutable pull queue for the scan's worker pool. Safe for multiple workers to pull from
 * the same queue concurrently — no two callers can ever receive the same check.
 */
// `next()` shifts synchronously off the front; JS's single-threaded execution makes each call an
// atomic claim, which is what rules out double-claiming.
export function createVerificationQueue(checks: VerificationCheck[]): VerificationQueue {
  const remaining = [...checks]
  return {
    next: () => remaining.shift(),
  }
}
