import { ActiveSkillId } from "../../Skills"
import { AttrValue } from "../../System/Attribute"
import { BaseGearData, GearType } from "../GearData"
import { WeaponAttr } from "./WeaponAttr"

export interface WeaponData extends BaseGearData {
  gearType: GearType.weapon

  attributes: {
    [WeaponAttr.dv]: string
    [WeaponAttr.attackRatings]: string
    [WeaponAttr.modes]?: string
    [WeaponAttr.ammo]?: string
    [key: string]: AttrValue
  }

  skill: ActiveSkillId
  specialtyName?: string
}

export function isWeapon(gear: BaseGearData): gear is WeaponData {
  return gear.gearType === GearType.weapon
}
