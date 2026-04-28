import type { AttributeKey } from "#/system/attributeKey.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { FirearmTypeKey } from "./weapons/firearms/firearmTypeKey.ts"

export enum FirearmAttachmentPoint {
  Internal = "Internal",
  Top = "Top",
  Under = "Under",
  Barrel = "Barrel",
}

export enum WeaponType {
  melee = "melee",
  thrown = "thrown",
  projectile = "projectile",
  firearm = "firearm",
  exotic = "exotic",
  other = "other",
}

/** The sub-type of a melee weapon, which determines the associated combat skill. */
export enum MeleeWeaponType {
  blade = "blade",
  club = "club",
}

export interface WeaponData extends ItemData {
  dmg: string
  dmgType?: "physical" | "stun" | "custom"
  ap?: number
  itemType: ItemType.weapon
  weaponType: WeaponType
  skill: SkillKey
  attribute?: AttributeKey
}

export interface FirearmData extends WeaponData {
  weaponType: WeaponType.firearm
  firearmType: FirearmTypeKey
  firemodes: string[]
  recoil: number
  attachmentPoints?: FirearmAttachmentPoint[]

  ammo: {
    size: number
    remaining: number
    type:
      | "break"
      | "clip"
      | "drum"
      | "muzzle"
      | "magazine"
      | "cylinder"
      | "belt"
  }
}

export interface MeleeWeaponData extends WeaponData {
  weaponType: WeaponType.melee
  reach: number
  meleeType?: MeleeWeaponType
}

export interface FirearmAccessoryData extends ItemData {
  itemType: ItemType.firearmAccessory
  enabled?: boolean
  mountPoints: FirearmAttachmentPoint[]
  parentSlot?: FirearmAttachmentPoint
}

export function isWeaponData(item: ItemData): item is WeaponData {
  return item.itemType === ItemType.weapon
}

export function isFirearmData(item: ItemData): item is FirearmData {
  return isWeaponData(item) && item.weaponType === WeaponType.firearm
}
