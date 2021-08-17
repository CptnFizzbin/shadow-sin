import { FC } from 'react'

import { CharacterAttribute } from '../../../Character/CharacterAttribute'
import { useSkill } from '../../../Character/CharacterProvider'
import { useAttribute } from '../../../System/AttributeProvider'
import { hasExpertise, hasSpecialty } from '../../../System/Skill/Helpers'
import { ActiveSkillData, ActiveSkillId } from '../../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../../UI/DicePool'
import { useTargetingAutosoft } from '../../Software/Autosoft/AutosoftProvider'
import { VehicleAttribute } from '../../Vehicles/VehicleAttribute'
import { WeaponData } from '../WeaponData'

interface FirearmPoolProps {
  weapon: WeaponData
}

export const BasicAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const agilityAttr = useAttribute(CharacterAttribute.agility)
  const firearmsSkill = useSkill<ActiveSkillData>(ActiveSkillId.firearms)

  const groups: DiceGroup[] = []
  groups.push({ name: 'Agility', size: agilityAttr?.value })
  groups.push({ name: 'Firearms', size: firearmsSkill?.rank })

  if (hasSpecialty(firearmsSkill, weapon.specialtyName)) {
    groups.push({ name: 'Specialty', size: 2 })
  }

  if (hasExpertise(firearmsSkill, weapon.specialtyName)) {
    groups.push({ name: 'Expertise', size: 3 })
  }

  return <DicePool
    name={'Basic Attack'}
    groups={groups}
  />
}

export const DroneAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const sensorAttr = useAttribute(VehicleAttribute.sensor)
  const targetingAutosoft = useTargetingAutosoft(weapon.name)

  return <DicePool
    name={'Drone Attack'}
    groups={[
      { name: 'Sensor', size: sensorAttr?.value },
      { name: 'Targeting', size: targetingAutosoft?.rating, default: -1 },
    ]}
  />
}

export const VehicleAttackPool: FC<FirearmPoolProps> = () => {
  const logicAttr = useAttribute(CharacterAttribute.logic)
  const engineeringSkill = useSkill<ActiveSkillData>(ActiveSkillId.engineering)

  return <DicePool
    name={'Vehicle Attack'}
    groups={[
      { name: 'Logic', size: logicAttr?.value },
      { name: 'Engineering', size: engineeringSkill?.rank },
    ]}
  />
}

export const RiggedAttackPool: FC<FirearmPoolProps> = () => {
  const logicAttr = useAttribute(CharacterAttribute.logic)
  const engineeringSkill = useSkill<ActiveSkillData>(ActiveSkillId.engineering)

  return <DicePool
    name={'Rigged Attack'}
    groups={[
      { name: 'Logic', size: logicAttr?.value },
      { name: 'Engineering', size: engineeringSkill?.rank },
    ]}
  />
}
