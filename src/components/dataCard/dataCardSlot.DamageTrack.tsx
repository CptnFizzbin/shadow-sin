import type { FC } from "react"

import type { InlineDamageTrackProps } from "#/components/system/damage/inlineDamageTrack.tsx"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"

/** Wraps InlineDamageTrack for use as a DataCard slot, displayed under the stat line. */
export const DataCardSlotDamageTrack: FC<InlineDamageTrackProps> = (props) => (
  <InlineDamageTrack {...props} />
)

DataCardSlotDamageTrack.displayName = "DataCard.DamageTrack"
