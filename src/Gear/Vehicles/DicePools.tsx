import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterAttr'
import { useActiveSkill } from '../../Character/CharacterProvider'
import { ActiveSkillIds, hasExpertise, hasSpecialty } from '../../Skills'
import { useAttribute } from '../../System/AttributeProvider'
import { DamageType } from '../../System/Damage/DamageType'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { AugmentAttr } from '../Augments/AugmentAttr'
import { AugmentData, AugmentType } from '../Augments/AugmentData'
import { useFindGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { AutosoftAttr } from '../Software/Autosoft/AutosoftAttr'
import { AutosoftType } from '../Software/Autosoft/AutosoftData'
import { useAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleAttr } from './VehicleAttr'
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

export const DroneEvasion: FC<VehiclePoolProps> = () => {
  const evasionAutosoft = useAutosoft(AutosoftType.evasion)

  const evasion: number = evasionAutosoft ? evasionAutosoft.attributes[AutosoftAttr.rating] : -1

  const diceGroups: DiceGroup[] = [{ name: 'Evasion', size: evasion }]

  return <DicePool
    poolKey={VehiclePoolKeys.pilotEvade}
    name={'Evasion'}
    groups={diceGroups}
    attrs={[VehicleAttr.pilot]}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}
export const DroneManeuvering: FC<VehiclePoolProps> = () => {
  const maneuveringAutosoft = useAutosoft(AutosoftType.maneuvering)

  const maneuvering: number = maneuveringAutosoft ? maneuveringAutosoft.attributes[AutosoftAttr.rating] : -1

  const diceGroups: DiceGroup[] = [{ name: 'Maneuvering', size: maneuvering }]

  return <DicePool
    poolKey={VehiclePoolKeys.pilotEvade}
    name={'Maneuvering'}
    groups={diceGroups}
    attrs={[VehicleAttr.pilot]}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const DroneStealth: FC<VehiclePoolProps> = () => {
  const stealthAutosoft = useAutosoft(AutosoftType.stealth)

  const stealth: number = stealthAutosoft ? stealthAutosoft.attributes[AutosoftAttr.rating] : -1

  const diceGroups: DiceGroup[] = [{ name: 'Stealth', size: stealth }]

  return <DicePool
    poolKey={VehiclePoolKeys.pilotEvade}
    name={'Stealth'}
    groups={diceGroups}
    attrs={[VehicleAttr.pilot]}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const DronePerception: FC<VehiclePoolProps> = () => {
  const clearsightAutosoft = useAutosoft(AutosoftType.clearsight)

  const clearsight: number = clearsightAutosoft ? clearsightAutosoft.attributes[AutosoftAttr.rating] : -1

  const diceGroups: DiceGroup[] = [{ name: 'Clearsight', size: clearsight }]

  return <DicePool
    poolKey={VehiclePoolKeys.pilotEvade}
    name={'Perception'}
    groups={diceGroups}
    attrs={[VehicleAttr.sensor]}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const DroneCracking: FC<VehiclePoolProps> = () => {
  const warfareAutosoft = useAutosoft(AutosoftType.electronicWarfare)

  const warfare: number = warfareAutosoft ? warfareAutosoft.attributes[AutosoftAttr.rating] : -1

  const diceGroups: DiceGroup[] = [{ name: 'Elc. Warfare', size: warfare }]

  return <DicePool
    poolKey={VehiclePoolKeys.pilotEvade}
    name={'Cracking'}
    groups={diceGroups}
    attrs={[VehicleAttr.sensor]}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const DriverPiloting: FC<VehiclePoolProps> = ({
  vehicle,
}) => {
  const pilotingSkill = useActiveSkill(ActiveSkillIds.CRB.piloting)
  const reaction = useAttribute<number>(CharacterAttr.reaction) || 0

  const groups: DiceGroup[] = [
    { name: 'Piloting', size: pilotingSkill?.rank || -1 },
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
  const pilotingSkill = useActiveSkill(ActiveSkillIds.CRB.piloting)
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const controlRig = useFindGear<AugmentData>(gear => gear.augmentType === AugmentType.controlRig)
  if (!controlRig || !riggerInterface) return null

  const groups: DiceGroup[] = [
    { name: 'Piloting', size: pilotingSkill?.rank || -1 },
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
