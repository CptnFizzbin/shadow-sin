import type { FC } from "react"

import type { Rating } from "#/system/rating.ts"

import { CardElementStat } from "./cardElementStat.tsx"

export interface CardElementRatingProps {
  value: Rating<string> | undefined
}

/** Sugar for a `Stat` chip styled as a rating — kept separate so callers don't need to know that. */
export const CardElementRating: FC<CardElementRatingProps> = ({ value }) => {
  if (value === undefined) return null
  return <CardElementStat label="Rating" value={value} type="rating" />
}

CardElementRating.displayName = "EntityCard.Rating"
