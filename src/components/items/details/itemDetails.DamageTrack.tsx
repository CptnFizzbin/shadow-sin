import type { FC } from "react"

import DamageTrack from "#/components/system/damage/damageTrack.tsx"

export interface ItemDetailsDamageTrackProps {
  label: string
  max: number
  current: number
  onChange: (value: number) => void
  allowOverflow?: boolean
  woundInterval?: number
  columns?: number
}

/**
 * Full-fidelity damage track for ItemDetails, reusing the same `DamageTrack`
 * StatusSheets use — unlike the compact `InlineDamageTrack` DataCard uses.
 */
export const ItemDetailsDamageTrack: FC<ItemDetailsDamageTrackProps> = (props) => (
  <DamageTrack {...props} />
)

ItemDetailsDamageTrack.displayName = "ItemDetails.DamageTrack"
