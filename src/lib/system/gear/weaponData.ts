import type { ItemData } from "#/lib/system/ItemData.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { FirearmTypeKey } from "#/lib/system/gear/weapons/firearms/firearm-type-key.ts"
import { GearType } from "../gearType.ts"

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

export interface WeaponData extends ItemData {
  dmg: string
  ap?: number
  itemType: GearType.weapon
  weaponType: WeaponType | string
  skill?: string
  attribute?: AttributeKey
}

export interface FirearmData extends WeaponData {
  weaponType: WeaponType.firearm
  firearmType: FirearmTypeKey | string
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
}

export interface ThrownWeaponData extends WeaponData {
  weaponType: WeaponType.thrown
  range: number
}

export interface ProjectileWeaponData extends WeaponData {
  weaponType: WeaponType.projectile
  range: number
}

export interface FirearmAccessoryData extends ItemData {
  itemType: GearType.firearmAccessory
  enabled?: boolean
  mountPoints: FirearmAttachmentPoint[]
  parentSlot?: FirearmAttachmentPoint
}

export function isWeaponData(item: ItemData): item is WeaponData {
  return item.itemType === GearType.weapon
}

export function isFirearmData(item: ItemData): item is FirearmData {
  return isWeaponData(item) && item.weaponType === WeaponType.firearm
}

export function isMeleeWeaponData(item: ItemData): item is MeleeWeaponData {
  return isWeaponData(item) && item.weaponType === WeaponType.melee
}

export function isThrownWeaponData(item: ItemData): item is ThrownWeaponData {
  return isWeaponData(item) && item.weaponType === WeaponType.thrown
}

export function isProjectileWeaponData(
  item: ItemData,
): item is ProjectileWeaponData {
  return isWeaponData(item) && item.weaponType === WeaponType.projectile
}

export function isFirearmAccessoryData(
  item: ItemData,
): item is FirearmAccessoryData {
  return item.itemType === GearType.firearmAccessory
}
