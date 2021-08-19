import { FC } from 'react'

import { CharacterAttr } from '../../../Character/CharacterData'
import { useSkill } from '../../../Character/CharacterProvider'
import { useAttributeValue } from '../../../System/AttributeProvider'
import { hasExpertise, hasSpecialty } from '../../../System/Skill/Helpers'
import { ActiveSkillData, ActiveSkillId } from '../../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../../UI/DicePool'
import { ControlRigData, HeadwearTypes } from '../../Augments/HeadwearData'
import { useFindGear } from '../../GearContext'
import { AutosoftAttr } from '../../Software/Autosoft/AutosoftData'
import { useTargetingAutosoft } from '../../Software/Autosoft/AutosoftProvider'
import { VehicleAttr } from '../../Vehicles/VehicleData'
import { WeaponData } from '../WeaponData'

interface FirearmPoolProps {
  weapon: WeaponData
}

export const BasicAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const agility = useAttributeValue<number>(CharacterAttr.agility, 0)
  const firearmsSkill = useSkill<ActiveSkillData>(ActiveSkillId.firearms)

  const groups: DiceGroup[] = []
  groups.push({ name: 'Agility', size: agility })
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
  const sensor = useAttributeValue<number>(VehicleAttr.sensor, 0)
  const targetingAutosoft = useTargetingAutosoft(weapon.name)

  const targeting = targetingAutosoft
    ? targetingAutosoft.attributes[AutosoftAttr.rating].value
    : -1

  return <DicePool
    name={'Drone Attack'}
    groups={[
      { name: 'Sensor', size: sensor },
      { name: 'Targeting', size: targeting },
    ]}
  />
}

export const VehicleAttackPool: FC<FirearmPoolProps> = () => {
  const logic = useAttributeValue<number>(CharacterAttr.logic, 0)
  const engineeringSkill = useSkill<ActiveSkillData>(ActiveSkillId.engineering)

  return <DicePool
    name={'Vehicle Attack'}
    groups={[
      { name: 'Logic', size: logic },
      { name: 'Engineering', size: engineeringSkill?.rank },
    ]}
  />
}

export const RiggedAttackPool: FC<FirearmPoolProps> = () => {
  const logicAttr = useAttributeValue<number>(CharacterAttr.logic, 0)
  const engineeringSkill = useSkill<ActiveSkillData>(ActiveSkillId.engineering)

  const controlRig = useFindGear<ControlRigData>(gear => gear.type === HeadwearTypes.controlRig)
  if (!controlRig) return null

  return <DicePool
    name={'Rigged Attack'}
    groups={[
      { name: 'Logic', size: logicAttr },
      { name: 'Engineering', size: engineeringSkill?.rank },
      { name: 'Control Rig', size: controlRig.attributes.rating.value },
    ]}
  />
}
