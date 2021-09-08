import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterData'
import { useActiveSkill } from '../../Character/CharacterProvider'
import { useAttribute } from '../../System/AttributeProvider'
import { DamageType } from '../../System/Damage/DamageType'
import { hasExpertise, hasSpecialty } from '../../System/Skill/Helpers'
import { ActiveSkillData, ActiveSkillId } from '../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { ControlRigAttr, ControlRigData } from '../Augments/ControlRigData'
import { useFindGear } from '../GearContext'
import { GearType } from '../GearData'
import { AutosoftAttr } from '../Software/Autosoft/AutosoftData'
import { useTargetingAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleAttr } from '../Vehicles/VehicleData'
import { WeaponData } from './WeaponData'

interface FirearmPoolProps {
  weapon: WeaponData
}

export const BasicAttackPool: FC<FirearmPoolProps> = ({
  weapon,
}) => {
  const agility = useAttribute<number>(CharacterAttr.agility) || 0
  const firearmsSkill = useActiveSkill<ActiveSkillData>(ActiveSkillId.firearms)

  const groups: DiceGroup[] = []
  groups.push({ name: 'Agility', size: agility })
  groups.push({ name: 'Firearms', size: firearmsSkill?.rank })

  if (hasSpecialty(firearmsSkill, weapon.specialtyName)) {
    groups.push({ name: 'Specialty', size: 2 })
  }

  if (hasExpertise(firearmsSkill, weapon.specialtyName)) {
    groups.push({ name: 'Expertise', size: 3 })
  }

  const dmgPenaltyTypes = [DamageType.charPhysical, DamageType.charStun]
  return <DicePool name={'Basic Attack'} groups={groups} dmgPenaltyTypes={dmgPenaltyTypes} />
}

export const DroneAttackPool: FC<FirearmPoolProps> = ({
  weapon,
}) => {
  const sensor = useAttribute<number>(VehicleAttr.sensor) || 0
  const targetingAutosoft = useTargetingAutosoft(weapon.name)

  const targeting = targetingAutosoft
    ? targetingAutosoft.attributes[AutosoftAttr.rating]
    : -1

  const diceGroups: DiceGroup[] = [
    { name: 'Sensor', size: sensor },
    { name: 'Targeting', size: targeting },
  ]
  const dmgPenaltyTypes = [DamageType.vehiclePhysical]
  return <DicePool name={'Drone Attack'} groups={diceGroups} dmgPenaltyTypes={dmgPenaltyTypes} />
}

export const VehicleAttackPool: FC<FirearmPoolProps> = () => {
  const logic = useAttribute<number>(CharacterAttr.logic) || 0
  const engineeringSkill = useActiveSkill<ActiveSkillData>(ActiveSkillId.engineering)

  const diceGroups: DiceGroup[] = [
    { name: 'Logic', size: logic },
    { name: 'Engineering', size: engineeringSkill?.rank },
  ]

  const dmgPenaltyTypes = [DamageType.charPhysical, DamageType.charStun]
  return <DicePool name={'Vehicle Attack'} groups={diceGroups} dmgPenaltyTypes={dmgPenaltyTypes} />
}

export const RiggedAttackPool: FC<FirearmPoolProps> = () => {
  const logicAttr = useAttribute<number>(CharacterAttr.logic) || 0
  const engineeringSkill = useActiveSkill<ActiveSkillData>(ActiveSkillId.engineering)

  const controlRig = useFindGear<ControlRigData>(gear => gear.gearType === GearType.controlRig)
  if (!controlRig) return null

  const diceGroups: DiceGroup[] = [
    { name: 'Logic', size: logicAttr },
    { name: 'Engineering', size: engineeringSkill?.rank },
    { name: 'Control Rig', size: controlRig.attributes[ControlRigAttr.rating] },
  ]

  const dmgPenaltyTypes = [DamageType.charPhysical, DamageType.charStun, DamageType.vehiclePhysical]
  return <DicePool name={'Rigged Attack'} groups={diceGroups} dmgPenaltyTypes={dmgPenaltyTypes} />
}
