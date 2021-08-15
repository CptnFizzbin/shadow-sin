import { FC } from 'react'

import { Stat } from '../../UI/StatBlock'

export type DamageValue = {
  value: number
  type: 'S' | 'P'
  special?: boolean
}

interface DamageValueStatProps {
  dv: DamageValue
}

export const DamageValueStat: FC<DamageValueStatProps> = ({
  dv,
}) => {
  return (
    <Stat name="DV" value={dv.value + dv.type} />
  )
}
export type AttackRating = number | '-'

interface AttackRatingStatProps {
  ratings: AttackRating[]
}

export const AttackRatingStat: FC<AttackRatingStatProps> = ({
  ratings,
}) => {
  // ranges = ['Close (0-3m)', 'Near (4-50m)', 'Medium (51-250m)', 'Far (251-500m)', 'Extreme (> 500m)']

  return (
    <Stat name="Atk. Ratings">{ratings.join('/')}</Stat>
  )
}
