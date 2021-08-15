import { FC } from 'react'

import { Stat } from '../UI/StatBlock'

export type Cost = number

export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}

interface CostStatProps {
  cost: Cost
}

const costFormatter = new Intl.NumberFormat('en')
export const CostStat: FC<CostStatProps> = ({
  cost,
}) => {
  return (
    <Stat name="Cost" value={`${costFormatter.format(cost)}¥`} />
  )
}

interface AvailabilityProps {
  avail: Availability
}

export const AvailabilityStat: FC<AvailabilityProps> = ({
  avail,
}) => {
  return (
    <Stat name={'Avail'}>
      {avail.rarity}
      {avail.illegal ? '(i)' : null}
      {avail.license ? '(L)' : null}
    </Stat>
  )
}
