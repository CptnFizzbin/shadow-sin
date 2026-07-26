import type { VerificationCheck } from "./licenseCheckTypes.ts"

export interface VerificationQueue {
  next: () => VerificationCheck | undefined
}

/**
 * A shared, mutable pull queue for the scan's worker pool. `next()` synchronously shifts the next
 * check off the front, so concurrent workers pulling from the same queue can never double-claim
 * one — JS's single-threaded execution makes each call an atomic claim.
 */
export function createVerificationQueue(checks: VerificationCheck[]): VerificationQueue {
  const remaining = [...checks]
  return {
    next: () => remaining.shift(),
  }
}
