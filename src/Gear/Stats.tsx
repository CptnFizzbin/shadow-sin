import { FC } from 'react'

import { Stat } from '../UI/StatBlock'

export type Cost = number

export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}

interface CostProps {
  cost: Cost
}

const costFormatter = new Intl.NumberFormat('en')
export const CostStat: FC<CostProps> = ({
  cost,
}) => {
  return (
    <Stat name="Cost"><CostDisplay cost={cost} /></Stat>
  )
}

export const CostDisplay: FC<CostProps> = ({
  cost,
}) => {
  return (
    <span>{costFormatter.format(cost)}¥</span>
  )
}

interface AvailabilityProps {
  avail: Availability
}

export const AvailabilityStat: FC<AvailabilityProps> = ({
  avail,
}) => {
  return (
    <Stat name={'Avail'}><AvailabilityDisplay avail={avail} /></Stat>
  )
}

export const AvailabilityDisplay: FC<AvailabilityProps> = ({
  avail,
}) => {
  return (
    <span>
      {avail.rarity}
      {avail.illegal ? '(i)' : null}
      {avail.license ? '(L)' : null}
    </span>
  )
}
