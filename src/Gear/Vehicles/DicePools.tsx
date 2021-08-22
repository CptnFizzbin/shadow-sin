import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterData'
import { useSkill } from '../../Character/CharacterProvider'
import { useAttribute } from '../../System/AttributeProvider'
import { useDamagePenalty } from '../../System/Damage/DamageContext'
import { DamageType } from '../../System/Damage/DamageType'
import { ActiveSkillData, ActiveSkillId } from '../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { ControlRigAttr, ControlRigData } from '../Augments/ControlRigData'
import { useFindGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { AutosoftAttr, AutosoftType } from '../Software/Autosoft/AutosoftData'
import { useAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

interface VehiclePoolProps {
  vehicle: VehicleData
}

export const PilotEvadePool: FC<VehiclePoolProps> = () => {
  const evasionAutosoft = useAutosoft(AutosoftType.evasion)
  const maneuveringAutosoft = useAutosoft(AutosoftType.maneuvering)

  const piloting: number = maneuveringAutosoft ? maneuveringAutosoft.attributes[AutosoftAttr.rating] : 0
  const evasion: number = evasionAutosoft ? evasionAutosoft.attributes[AutosoftAttr.rating] : 0

  const dmgPenalty = useDamagePenalty([DamageType.vehiclePhysical])

  const diceGroups: DiceGroup[] = [
    { name: 'Piloting', size: piloting },
    { name: 'Evasion', size: evasion },
  ]

  return <DicePool name={'Pilot Evade'} groups={diceGroups} damagePenalty={dmgPenalty} />
}

export const RiggedEvadePool: FC<VehiclePoolProps> = ({
  vehicle,
}) => {
  const pilotingSkill = useSkill<ActiveSkillData>(ActiveSkillId.piloting)
  const intuition = useAttribute<number>(CharacterAttr.intuition, 0)

  const dmgPenalty = useDamagePenalty([DamageType.charPhysical, DamageType.charStun, DamageType.vehiclePhysical])

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const controlRig = useFindGear<ControlRigData>(gear => gear.gearType === GearType.controlRig)
  if (!controlRig || !riggerInterface) return null

  const groups: DiceGroup[] = [
    { name: 'Piloting', size: pilotingSkill?.rank },
    { name: 'Intuition', size: intuition },
    { name: 'Control Rig', size: controlRig.attributes[ControlRigAttr.rating] },
  ]

  return <DicePool name={'Rigged Evade'} groups={groups} damagePenalty={dmgPenalty} />
}
