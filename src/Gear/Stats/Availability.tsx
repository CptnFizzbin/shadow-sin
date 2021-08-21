import { FC } from 'react'

import { Stat } from '../../UI/StatBlock'

export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}

interface AvailabilityProps {
  avail: Availability
}

export const AvailabilityStat: FC<AvailabilityProps> = ({
  avail,
}) => {
  return (
    <Stat name={'Avail'} value={formatAvail(avail)} />
  )
}

export const formatAvail = (avail: Availability): string => {
  return `${avail.rarity}${avail.illegal ? '(i)' : ''}${avail.license ? '(L)' : ''}`
}
