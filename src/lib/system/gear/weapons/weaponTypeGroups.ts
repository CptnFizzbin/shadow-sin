import { WeaponType } from "#/lib/system/gear/weaponData.ts"

/** Weapon types that use melee combat skills. */
export const meleeWeaponTypes: WeaponType[] = [WeaponType.melee, WeaponType.thrown]

/** Weapon types that use ranged combat skills. */
export const rangedWeaponTypes: WeaponType[] = [
  WeaponType.firearm,
  WeaponType.projectile,
  WeaponType.exotic,
  WeaponType.other,
]
