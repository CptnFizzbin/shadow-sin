import type { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { ItemData } from "#/lib/system/item-data.ts"
import { GearType } from "../gear-type.ts"

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

export enum FirearmType {
  taser = "taser",
  holdout = "holdout",
  lightPistol = "light pistol",
  heavyPistol = "heavy pistol",
  machinePistol = "machine pistol",
  smg = "submachine gun",
  assaultRifle = "assault rifle",
  sportRifle = "sport rifle",
  sniperRifle = "sniper rifle",
  shotgun = "shotgun",
  special = "special",
  lmg = "light machine gun",
  mmg = "medium machine gun",
  hmg = "heavy machine gun",
  grenadeLauncher = "grenade launcher",
  assultCannon = "assault cannon",
  missleLauncher = "missile launcher",
}

export interface FirearmData extends WeaponData {
  weaponType: WeaponType.firearm
  firearmType: FirearmType | string
  firemodes: string[]
  recoil: number

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

  ranges: {
    short: number
    medium: number
    long: number
    extreme: number
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
