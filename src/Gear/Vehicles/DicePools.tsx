import { FC } from 'react'

import { useSkill } from '../../Character/CharacterProvider'
import { useAttribute } from '../../System/AttributeProvider'
import { ActiveSkillData, ActiveSkillId } from '../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { AutosoftType } from '../Software/Autosoft/AutosoftData'
import { useAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleData } from './VehicleData'

interface VehiclePoolProps {
  vehicle: VehicleData
}

type VehicleDicePool = FC<VehiclePoolProps>

export const PilotEvadePool: VehicleDicePool = () => {
  const evasionAutosoft = useAutosoft(AutosoftType.evasion)
  const maneuveringAutosoft = useAutosoft(AutosoftType.maneuvering)

  const piloting: number = maneuveringAutosoft ? maneuveringAutosoft.attributes.rating.value : 0
  const evasion: number = evasionAutosoft ? evasionAutosoft.attributes.rating.value : 0

  const groups: DiceGroup[] = []
  groups.push({ name: 'Piloting', size: piloting })
  groups.push({ name: 'Evasion', size: evasion })

  return <DicePool name={'Pilot Evade'} groups={groups} />
}

export const RiggedEvadePool: VehicleDicePool = () => {
  const pilotingSkill = useSkill<ActiveSkillData>(ActiveSkillId.piloting)
  const reactionAttr = useAttribute<number>('reaction')

  const groups: DiceGroup[] = []
  groups.push({ name: 'Piloting', size: pilotingSkill?.rank })
  groups.push({ name: 'Reaction', size: reactionAttr?.value })

  return <DicePool
    name={'Rigged Evade'}
    groups={groups}
  />
}
