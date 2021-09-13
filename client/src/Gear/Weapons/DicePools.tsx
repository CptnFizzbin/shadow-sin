import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterAttr'
import { useActiveSkill } from '../../Character/CharacterProvider'
import { DamageType } from '../../System/Damage/DamageType'
import { ActiveSkillData, hasExpertise, hasSpecialty } from '../../System/Skill/ActiveSkill/ActiveSkillData'
import { ActiveSkillId } from '../../System/Skill/ActiveSkill/ActiveSkillId'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { AugmentAttr } from '../Augments/AugmentAttr'
import { AugmentData, AugmentType } from '../Augments/AugmentData'
import { useFindGear } from '../GearContext'
import { useTargetingAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleAttr } from '../Vehicles/VehicleAttr'
import { WeaponData } from './WeaponData'

export enum WeaponPoolKeys {
  basicAttack = 'weapon.basicAttack',
  droneAttack = 'weapon.droneAttack',
  mountedAttack = 'weapon.mountedAttack',
  riggedAttack = 'weapon.riggedAttack',
}

interface FirearmPoolProps {
  weapon: WeaponData
}

export const BasicAttackPool: FC<FirearmPoolProps> = ({
  weapon,
}) => {
  const firearmsSkill = useActiveSkill<ActiveSkillData>(ActiveSkillId.firearms)

  const bonuses: DiceGroup[] = []
  if (hasSpecialty(firearmsSkill, weapon.specialtyName)) bonuses.push({ name: 'Specialty', size: 2 })
  if (hasExpertise(firearmsSkill, weapon.specialtyName)) bonuses.push({ name: 'Expertise', size: 3 })

  return <DicePool
    key={WeaponPoolKeys.basicAttack}
    name={'Basic Attack'}
    attrs={[CharacterAttr.agility]}
    skills={[ActiveSkillId.firearms]}
    bonuses={bonuses}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
  />
}

export const DroneAttackPool: FC<FirearmPoolProps> = ({
  weapon,
}) => {
  const targetingAutosoft = useTargetingAutosoft(weapon.name) || -1

  const targetingGroup: DiceGroup = { name: 'Targeting', size: targetingAutosoft }

  return <DicePool
    key={WeaponPoolKeys.droneAttack}
    name={'Drone Attack'}
    attrs={[VehicleAttr.sensor]}
    groups={[targetingGroup]}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const VehicleAttackPool: FC<FirearmPoolProps> = () => <DicePool
  key={WeaponPoolKeys.mountedAttack}
  name={'Mounted Attack'}
  attrs={[CharacterAttr.logic]}
  skills={[ActiveSkillId.engineering]}
  dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
/>

export const RiggedAttackPool: FC<FirearmPoolProps> = () => {
  const controlRig = useFindGear<AugmentData>(gear => gear.augmentType === AugmentType.controlRig)
  if (!controlRig) return null

  return <DicePool
    key={WeaponPoolKeys.riggedAttack}
    name={'Rigged Attack'}
    attrs={[CharacterAttr.logic]}
    skills={[ActiveSkillId.engineering]}
    bonuses={[
      { name: 'Control Rig', size: controlRig.attributes[AugmentAttr.rating] },
    ]}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun, DamageType.vehiclePhysical]}
  />
}
