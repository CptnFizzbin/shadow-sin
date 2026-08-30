import type { FC } from "react"

import { CardElementStat } from "./cardElementStat.tsx"

export interface CardElementRatingProps {
  /** A plain numeric rating, or a caller-supplied display override (e.g. "Real" for a Real SIN/Licence). */
  value: string | number | undefined
}

/** Sugar for a `Stat` chip styled as a rating — kept separate so callers don't need to know that. */
export const CardElementRating: FC<CardElementRatingProps> = ({ value }) => {
  if (value === undefined) return null
  return <CardElementStat label="Rating" value={value} type="rating" />
}

CardElementRating.displayName = "EntityCard.Rating"
