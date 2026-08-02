import type { FC } from "react"

import { DataCardSlotStat } from "./dataCardSlot.Stat.tsx"

export interface DataCardRatingProps {
  value: number | string | undefined
}

/** Sugar for a `Stat` chip styled as a rating — kept separate so callers don't need to know that. */
export const DataCardSlotRating: FC<DataCardRatingProps> = ({ value }) => {
  if (value === undefined) return null
  return <DataCardSlotStat value={value} type="rating" />
}

DataCardSlotRating.displayName = "DataCard.Rating"
