import { FC } from 'react'

import { CharacterAttr } from '../../Character/CharacterData'
import { useActiveSkill } from '../../Character/CharacterProvider'
import { useAttribute } from '../../System/AttributeProvider'
import { DamageType } from '../../System/Damage/DamageType'
import { ActiveSkillData, ActiveSkillId } from '../../System/Skill/SkillData'
import { DiceGroup, DicePool } from '../../UI/DicePool'
import { AugmentAttr, AugmentData, AugmentType } from '../Augments/AugmentData'
import { useFindGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { AutosoftAttr, AutosoftType } from '../Software/Autosoft/AutosoftData'
import { useAutosoft } from '../Software/Autosoft/AutosoftProvider'
import { VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

export enum VehiclePoolKeys {
  pilotEvade = 'vehicle.pilotEvade',
  riggedEvade = 'vehicle.riggedEvade',
}

interface VehiclePoolProps {
  vehicle: VehicleData
}

export const PilotEvadePool: FC<VehiclePoolProps> = () => {
  const evasionAutosoft = useAutosoft(AutosoftType.evasion)
  const maneuveringAutosoft = useAutosoft(AutosoftType.maneuvering)

  const piloting: number = maneuveringAutosoft ? maneuveringAutosoft.attributes[AutosoftAttr.rating] : 0
  const evasion: number = evasionAutosoft ? evasionAutosoft.attributes[AutosoftAttr.rating] : 0

  const diceGroups: DiceGroup[] = [
    { name: 'Piloting', size: piloting },
    { name: 'Evasion', size: evasion },
  ]

  return <DicePool
    key={VehiclePoolKeys.pilotEvade}
    name={'Pilot Evade'}
    groups={diceGroups}
    dmgPenaltyTypes={[DamageType.vehiclePhysical]}
  />
}

export const RiggedEvadePool: FC<VehiclePoolProps> = ({
  vehicle,
}) => {
  const pilotingSkill = useActiveSkill<ActiveSkillData>(ActiveSkillId.piloting)
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

  const dmgPenaltyTypes = [DamageType.charPhysical, DamageType.charStun, DamageType.vehiclePhysical]
  return <DicePool
    key={VehiclePoolKeys.riggedEvade}
    name={'Rigged Evade'}
    groups={groups}
    dmgPenaltyTypes={dmgPenaltyTypes}
  />
}
