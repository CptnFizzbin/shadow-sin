import type { Duration } from "#/utils/duration/duration.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

export interface ExtendedTestEntry {
  id: UUID
  description: string
  interval: Duration
  hitsThreshold: number
  currentHits: number
  attempts: number
}

/** Whether `entry` has accumulated enough Hits to meet its Threshold. */
export function isExtendedTestComplete(entry: ExtendedTestEntry): boolean {
  return entry.currentHits >= entry.hitsThreshold
}
