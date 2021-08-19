import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterData'
import { useSkill } from '../../Character/CharacterProvider'
import { useAttributeValue } from '../../System/AttributeProvider'
import { ActiveSkillData, ActiveSkillId } from '../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { ControlRigData, HeadwearTypes } from '../Augments/HeadwearData'
import { useFindGear } from '../GearContext'
import { AutosoftAttr, AutosoftType } from '../Software/Autosoft/AutosoftData'
import { useAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleData } from './VehicleData'

interface VehiclePoolProps {
  vehicle: VehicleData
}

type VehicleDicePool = FC<VehiclePoolProps>

export const PilotEvadePool: VehicleDicePool = () => {
  const evasionAutosoft = useAutosoft(AutosoftType.evasion)
  const maneuveringAutosoft = useAutosoft(AutosoftType.maneuvering)

  const piloting: number = maneuveringAutosoft ? maneuveringAutosoft.attributes[AutosoftAttr.rating].value : 0
  const evasion: number = evasionAutosoft ? evasionAutosoft.attributes[AutosoftAttr.rating].value : 0

  const groups: DiceGroup[] = []
  groups.push({ name: 'Piloting', size: piloting })
  groups.push({ name: 'Evasion', size: evasion })

  return <DicePool name={'Pilot Evade'} groups={groups} />
}

export const RiggedEvadePool: VehicleDicePool = () => {
  const pilotingSkill = useSkill<ActiveSkillData>(ActiveSkillId.piloting)
  const intuition = useAttributeValue<number>(CharacterAttr.intuition, 0)

  const controlRig = useFindGear<ControlRigData>(gear => gear.type === HeadwearTypes.controlRig)
  if (!controlRig) return null

  const groups: DiceGroup[] = [
    { name: 'Piloting', size: pilotingSkill?.rank },
    { name: 'Intuition', size: intuition },
    { name: 'Control Rig', size: controlRig.attributes.rating.value },
  ]

  return <DicePool name={'Rigged Evade'} groups={groups} />
}
