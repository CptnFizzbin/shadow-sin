import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { GearData, GearType } from "./gearData.ts"



export enum WeaponType {
  melee = "melee",
  thrown = "thrown",
  projectile = "projectile",
  firearm = "firearm",
  exotic = "exotic",
  other = "other",
}

export interface WeaponData extends GearData {
  dmg: string
  ap?: number
  type: GearType.weapon
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

  attachments?: {
    mounts?: {
      top?: null | GearData
      under?: null | GearData
      barrel?: null | GearData
    }
    internal: GearData[]
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

export interface FirearmAccessoryData extends GearData {
  type: GearType.firearmAccessory
  enabled?: boolean
  mountPoints: Array<"top" | "under" | "barrel" | "internal">
}
