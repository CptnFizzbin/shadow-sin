import { FC } from 'react'

import { CharacterAttribute } from '../../../Character/CharacterAttribute'
import { useSkill } from '../../../Character/CharacterProvider'
import { useAttribute } from '../../../System/AttributeProvider'
import { ActiveSkillData, ActiveSkillId } from '../../../System/Skill/SkillData'
import { DicePool } from '../../../UI/DicePool'
import { useTargetingAutosoft } from '../../Software/Autosoft/AutosoftProvider'
import { VehicleAttribute } from '../../Vehicles/VehicleAttribute'
import { WeaponData } from '../WeaponData'

interface FirearmAttackDpProps {
  weapon: WeaponData
  specialtyType?: string
}

export const BasicAttackPool: FC<FirearmAttackDpProps> = () => {
  const agilityAttr = useAttribute(CharacterAttribute.agility)
  const firearmsSkill = useSkill<ActiveSkillData>(ActiveSkillId.firearms)

  return <DicePool
    name={'Basic Attack'}
    groups={[
      { name: 'Agility', size: agilityAttr?.value },
      { name: 'Firearms', size: firearmsSkill?.rank },
    ]}
  />
}

export const DroneAttackPool: FC<FirearmAttackDpProps> = ({ weapon }) => {
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

export const VehicleAttackPool: FC<FirearmAttackDpProps> = () => {
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

export const RiggedAttackPool: FC<FirearmAttackDpProps> = () => {
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
