import type { FC } from "react"

import type { InlineDamageTrackProps } from "#/components/system/damage/inlineDamageTrack.tsx"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"

/** Wraps InlineDamageTrack for use as an EntityCard element, displayed under the stat line. */
export const CardElementDamageTrack: FC<InlineDamageTrackProps> = (props) => (
  <InlineDamageTrack {...props} />
)

CardElementDamageTrack.displayName = "EntityCard.DamageTrack"
