import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterData'
import { VehicleAttr } from '../Gear/Vehicles/VehicleData'
import { Stat } from '../UI/StatBlock'
import { useAttribute } from './AttributeProvider'

export const CharacterDefRatingStat: FC = () => {
  const body = useAttribute<number>(CharacterAttr.body) || 0
  const armor = 0

  return (
    <Stat name="Def. Rating" value={body + armor} />
  )
}

export const VehicleDefRatingStat: FC = () => {
  const body = useAttribute<number>(VehicleAttr.body) || 0
  const armor = useAttribute<number>(VehicleAttr.armor) || 0

  return (
    <Stat name="Def. Rating" value={body + armor} />
  )
}
