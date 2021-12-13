import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterAttr'
import { useAllGear } from '../Gear/GearContext'
import { VehicleAttr } from '../Gear/Vehicles/VehicleAttr'
import { Stat } from '../UI/StatBlock'
import { useAttribute } from './AttributeProvider'
import { collectEffects, isDefRatingAdj } from './Effect'

export const CharacterDefRatingStat: FC = () => {
  const body = useAttribute<number>(CharacterAttr.body) || 0
  const bonus = collectEffects(useAllGear())
    .filter(isDefRatingAdj)
    .reduce((sum, effect) => sum + effect.value, 0)

  return (
    <Stat name="Def. Rating" value={body + bonus} />
  )
}

export const VehicleDefRatingStat: FC = () => {
  const body = useAttribute<number>(VehicleAttr.body) || 0
  const armor = useAttribute<number>(VehicleAttr.armor) || 0

  return (
    <Stat name="Def. Rating" value={body + armor} />
  )
}
