import type { FC } from "react"

import type { InlineDamageTrackProps } from "#/components/system/damage/inlineDamageTrack.tsx"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"

/** Wraps InlineDamageTrack for use as an ItemCard slot, displayed under the stat line. */
export const ItemCardDamageTrack: FC<InlineDamageTrackProps> = (props) => (
  <InlineDamageTrack {...props} />
)

ItemCardDamageTrack.displayName = "ItemCard.DamageTrack"
