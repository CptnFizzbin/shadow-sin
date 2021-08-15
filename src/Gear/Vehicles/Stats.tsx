import { FC } from 'react'

import { Stat } from '../../UI/StatBlock'

export type Handling = number | [number, number]

interface HandlingStatProps {
  handling: Handling
}

export const HandlingStat: FC<HandlingStatProps> = ({
  handling,
}) => {
  if (typeof handling === 'number') {
    return <Stat name="Handling">{handling}</Stat>
  } else {
    return <Stat name="Handling (On/Off road)">{handling[0]}/{handling[1]}</Stat>
  }
}

export type Seat = number | null

interface SeatStatProps {
  seat: Seat
}

export const SeatStat: FC<SeatStatProps> = ({
  seat,
}) => {
  return <Stat name="Seat">{seat ? seat : '-'}</Stat>
}
