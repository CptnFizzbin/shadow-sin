import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterData'
import { useFindGear } from '../Gear/GearContext'
import { GearType } from '../Gear/GearData'
import { RccAttr, RccData } from '../Gear/Rcc/RccData'
import { Stat } from '../UI/StatBlock'
import { useAttribute } from './AttributeProvider'

interface InitiativeStatProps {
  name: string
  base: number
  dice?: number
}

export const InitiativeStat: FC<InitiativeStatProps> = ({
  name,
  base,
  dice = 1,
}) => {
  return (
    <Stat name={name} value={`${base} + ${dice}D6`} />
  )
}

export const CharacterHotVrInit: FC = () => {
  const intuition = useAttribute<number>(CharacterAttr.intuition, 0)
  const rcc = useFindGear<RccData>(gear => gear.gearType === GearType.rcc)
  if (!rcc) return null

  const dataProcessing = rcc.attributes[RccAttr.dataProcessing]

  return (
    <InitiativeStat name="VR Cold Init" base={intuition + dataProcessing} dice={2} />
  )
}

export const CharacterColdVrInit: FC = () => {
  const intuition = useAttribute<number>(CharacterAttr.intuition, 0)
  const rcc = useFindGear<RccData>(gear => gear.gearType === GearType.rcc)
  if (!rcc) return null

  const dataProcessing = rcc.attributes[RccAttr.dataProcessing]

  return (
    <InitiativeStat name="VR Hot Init" base={intuition + dataProcessing} dice={3} />
  )
}
