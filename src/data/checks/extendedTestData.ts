import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { Duration } from "#/data/duration/duration.ts"

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
