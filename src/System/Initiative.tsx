import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterData'
import { useFindGear } from '../Gear/GearContext'
import { GearType } from '../Gear/GearData'
import { RccData } from '../Gear/Rigger/RccData'
import { Stat } from '../UI/StatBlock'
import { useAttributeValue } from './AttributeProvider'

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
    <Stat name={name}>{base} + {dice}D6</Stat>
  )
}

export const CharacterHotVrInit: FC = () => {
  const intuition = useAttributeValue<number>(CharacterAttr.intuition, 0)
  const rcc = useFindGear<RccData>(gear => gear.gearType === GearType.rcc)
  const dataProcessing = rcc?.attributes?.dataProcessing || null

  if (!dataProcessing) return null

  return (
    <InitiativeStat name="VR Cold Init" base={intuition + dataProcessing.value} dice={2} />
  )
}

export const CharacterColdVrInit: FC = () => {
  const intuition = useAttributeValue<number>(CharacterAttr.intuition, 0)
  const rcc = useFindGear<RccData>(gear => gear.gearType === GearType.rcc)
  const dataProcessing = rcc?.attributes?.dataProcessing || null

  if (!dataProcessing) return null

  return (
    <InitiativeStat name="VR Hot Init" base={intuition + dataProcessing.value} dice={3} />
  )
}
