import { FC } from 'react'

import { CharacterAttribute } from '../../Character/CharacterAttribute'
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

  const groups: DiceGroup[] = []
  groups.push({ name: 'Piloting', size: maneuveringAutosoft?.rating })
  groups.push({ name: 'Evasion', size: evasionAutosoft?.rating })

  return <DicePool
    name={'Pilot Evade'}
    groups={groups}
  />
}

export const RiggedEvadePool: VehicleDicePool = () => {
  const pilotingSkill = useSkill<ActiveSkillData>(ActiveSkillId.piloting)
  const reactionAttr = useAttribute(CharacterAttribute.reaction)

  const groups: DiceGroup[] = []
  groups.push({ name: 'Piloting', size: pilotingSkill?.rank })
  groups.push({ name: 'Reaction', size: reactionAttr?.value })

  return <DicePool
    name={'Rigged Evade'}
    groups={groups}
  />
}
