import type { FC } from "react"

import type { InlineDamageTrackProps } from "#/components/system/damage/inlineDamageTrack.tsx"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"

/**
 * Wraps `InlineDamageTrack` for use as a card element. Shared by `ItemCard` (Vehicle) and
 * `SpiritCard` (Spirit, Sprite) — sibling tiers, per ADR-0010 — which is why it lives in the flat
 * elements folder rather than being owned by either.
 */
export const CardElementDamageTrack: FC<InlineDamageTrackProps> = (props) => (
  <InlineDamageTrack {...props} />
)

CardElementDamageTrack.displayName = "ItemCard.DamageTrack"
