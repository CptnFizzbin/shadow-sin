import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterAttr'
import { useActiveSkill } from '../../Character/CharacterProvider'
import { useAttribute } from '../../System/AttributeProvider'
import { DamageType } from '../../System/Damage/DamageType'
import { hasExpertise, hasSpecialty } from '../../System/Skill/ActiveSkill/ActiveSkillData'
import { ActiveSkillId } from '../../System/Skill/ActiveSkill/ActiveSkillId'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { AugmentAttr } from '../Augments/AugmentAttr'
import { AugmentData, AugmentType } from '../Augments/AugmentData'
import { useFindGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { AutosoftAttr } from '../Software/Autosoft/AutosoftAttr'
import { AutosoftType } from '../Software/Autosoft/AutosoftData'
import { useAutosoft } from '../Software/Autosoft/AutosoftProvider'
import {VehicleAttr} from './VehicleAttr'
import { VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

export enum VehiclePoolKeys {
  resistDmg = 'vehicle.resistDmg',
  pilotEvade = 'vehicle.pilotEvade',
  riggedEvade = 'vehicle.riggedEvade',
}

interface VehiclePoolProps {
  vehicle: VehicleData
}

export const VehicleResistDmg: FC<VehiclePoolProps> = () => {
  return <DicePool
    name="Resist Dmg."
    poolKey={VehiclePoolKeys.resistDmg}
    attrs={[VehicleAttr.body]}
  />
}

export const AutosoftPiloting: FC<VehiclePoolProps> = () => {
  const evasionAutosoft = useAutosoft(AutosoftType.evasion)
  const maneuveringAutosoft = useAutosoft(AutosoftType.maneuvering)

  const piloting: number = maneuveringAutosoft ? maneuveringAutosoft.attributes[AutosoftAttr.rating] : 0
  const evasion: number = evasionAutosoft ? evasionAutosoft.attributes[AutosoftAttr.rating] : 0

  const diceGroups: DiceGroup[] = [
    { name: 'Piloting', size: piloting },
    { name: 'Evasion', size: evasion },
  ]

  return <DicePool
    poolKey={VehiclePoolKeys.pilotEvade}
    name={'Autosoft Piloting'}
    groups={diceGroups}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const DriverPiloting: FC<VehiclePoolProps> = ({
  vehicle,
}) => {
  const pilotingSkill = useActiveSkill(ActiveSkillId.piloting)
  const reaction = useAttribute<number>(CharacterAttr.reaction) || 0

  const groups: DiceGroup[] = [
    { name: 'Piloting', size: pilotingSkill?.rank },
    { name: 'Reaction', size: reaction },
  ]

  if (hasSpecialty(pilotingSkill, vehicle.pilotingSpeciality)) groups.push(
    { name: vehicle.pilotingSpeciality, size: 2 })
  if (hasExpertise(pilotingSkill, vehicle.pilotingSpeciality)) groups.push(
    { name: vehicle.pilotingSpeciality, size: 3 })

  const dmgPenaltyTypes = [DamageType.charPhysical, DamageType.charStun, DamageType.vehiclePhysical]
  return <DicePool
    poolKey={VehiclePoolKeys.riggedEvade}
    name={'Piloting'}
    groups={groups}
    dmgPenaltyTypes={dmgPenaltyTypes}
  />
}

export const RiggedPiloting: FC<VehiclePoolProps> = ({
  vehicle,
}) => {
  const pilotingSkill = useActiveSkill(ActiveSkillId.piloting)
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const controlRig = useFindGear<AugmentData>(gear => gear.augmentType === AugmentType.controlRig)
  if (!controlRig || !riggerInterface) return null

  const groups: DiceGroup[] = [
    { name: 'Piloting', size: pilotingSkill?.rank },
    { name: 'Intuition', size: intuition },
    { name: 'Control Rig', size: controlRig.attributes[AugmentAttr.rating] },
  ]

  if (hasSpecialty(pilotingSkill, vehicle.pilotingSpeciality)) groups.push(
    { name: vehicle.pilotingSpeciality, size: 2 })
  if (hasExpertise(pilotingSkill, vehicle.pilotingSpeciality)) groups.push(
    { name: vehicle.pilotingSpeciality, size: 3 })

  const dmgPenaltyTypes = [DamageType.charPhysical, DamageType.charStun, DamageType.vehiclePhysical]
  return <DicePool
    poolKey={VehiclePoolKeys.riggedEvade}
    name={'Rigged Piloting'}
    groups={groups}
    dmgPenaltyTypes={dmgPenaltyTypes}
  />
}
