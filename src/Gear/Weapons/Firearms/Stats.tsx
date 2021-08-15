import { FC } from 'react'

import { Stat } from '../../../UI/StatBlock'

export type Ammo = {
  size: number
  type: 'c' | 'm' | 'b' | 'cy' | 'belt'
}
export type FireMode = 'SS' | 'SA' | 'BF' | 'FA'

interface AmmoStatProps {
  ammo: Ammo | null
}

export const AmmoStat: FC<AmmoStatProps> = ({
  ammo,
}) => {
  return (
    <Stat name="Ammo">{ammo ? (<>{ammo.size}({ammo.type}</>) : '-'})</Stat>
  )
}

interface FirearmModeStatProps {
  modes: FireMode[] | null
}

export const FirearmModeStat: FC<FirearmModeStatProps> = ({
  modes,
}) => {
  return (
    <Stat name="Modes" value={modes ? modes.join('/') : '-'} />
  )
}
