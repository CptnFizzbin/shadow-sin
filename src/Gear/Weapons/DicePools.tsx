import { FC } from "react"

import { CharacterAttr } from "../../Character/CharacterAttr"
import { useActiveSkill } from "../../Character/CharacterProvider"
import { ActiveSkillIds } from "../../Skills"
import { DamageType } from "../../System/Damage/DamageType"
import {
  collectEffectBonuses,
  DiceGroup,
  DicePool,
  skillSpecialtyBonus,
} from "../../UI/DicePool"
import { AugmentAttr } from "../Augments/AugmentAttr"
import { AugmentData, AugmentType } from "../Augments/AugmentData"
import { useAllNestedGear, useFindGear } from "../GearContext"
import { useTargetingAutosoft } from "../Software/Autosoft/AutosoftProvider"
import { VehicleAttr } from "../Vehicles/VehicleAttr"
import { WeaponData } from "./WeaponData"

export enum WeaponPoolKeys {
  basicAttack = "weapon.basicAttack",
  droneAttack = "weapon.droneAttack",
  mountedAttack = "weapon.mountedAttack",
  riggedAttack = "weapon.riggedAttack",
}

interface FirearmPoolProps {
  weapon: WeaponData
}

export const BasicAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const skill = useActiveSkill(weapon.skill)
  const nestedGear = useAllNestedGear(weapon.id)

  let bonuses: DiceGroup[] = []

  const gearBonuses = collectEffectBonuses(
    nestedGear,
    WeaponPoolKeys.basicAttack,
  )
  if (gearBonuses) bonuses = [...bonuses, ...gearBonuses]

  const specialtyBonus = skillSpecialtyBonus(skill, weapon.specialtyName)
  if (specialtyBonus) bonuses = [...bonuses, specialtyBonus]

  return (
    <DicePool
      poolKey={WeaponPoolKeys.basicAttack}
      name={"Basic Attack"}
      attrs={[CharacterAttr.agility]}
      skills={[weapon.skill]}
      bonuses={bonuses}
      dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
    />
  )
}

export const DroneAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const targetingAutosoft = useTargetingAutosoft(weapon.name) || -1
  const targetingGroup: DiceGroup = {
    name: "Targeting",
    size: targetingAutosoft,
  }
  const nestedGear = useAllNestedGear(weapon.id)

  return (
    <DicePool
      poolKey={WeaponPoolKeys.droneAttack}
      name={"Drone Attack"}
      attrs={[VehicleAttr.sensor]}
      groups={[targetingGroup]}
      bonuses={collectEffectBonuses(nestedGear, WeaponPoolKeys.droneAttack)}
      dmgPenaltyTypes={[DamageType.vehiclePhysical]}
    />
  )
}

export const VehicleAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const nestedGear = useAllNestedGear(weapon.id)

  return (
    <DicePool
      poolKey={WeaponPoolKeys.mountedAttack}
      name={"Mounted Attack"}
      attrs={[CharacterAttr.logic]}
      skills={[ActiveSkillIds.CRB.engineering]}
      bonuses={collectEffectBonuses(nestedGear, WeaponPoolKeys.mountedAttack)}
      dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
    />
  )
}

export const RiggedAttackPool: FC<FirearmPoolProps> = ({ weapon }) => {
  const nestedGear = useAllNestedGear(weapon.id)

  const controlRig = useFindGear<AugmentData>(
    (gear) => gear.augmentType === AugmentType.controlRig,
  )
  if (!controlRig) return null

  return (
    <DicePool
      poolKey={WeaponPoolKeys.riggedAttack}
      name={"Rigged Attack"}
      attrs={[CharacterAttr.logic]}
      skills={[ActiveSkillIds.CRB.engineering]}
      bonuses={[
        {
          name: "Control Rig",
          size: controlRig.attributes[AugmentAttr.rating],
        },
        ...collectEffectBonuses(nestedGear, WeaponPoolKeys.riggedAttack),
      ]}
      dmgPenaltyTypes={[
        DamageType.charPhysical,
        DamageType.charStun,
        DamageType.vehiclePhysical,
      ]}
    />
  )
}
