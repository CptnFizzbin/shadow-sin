import type { FC } from "react"

import type { FirearmData } from "#/system/gear/weaponData.ts"

import { CardElementStat } from "./cardElementStat.tsx"

export interface CardElementAmmoProps {
  value: FirearmData["ammo"] | undefined
}

/**
 * Sugar for a `Stat` chip showing a Firearm's remaining/size ammo count — deliberately not a
 * generalization of `CardElementDamageTrack` into a shared current/max primitive (see
 * `docs/features/archive/0013-entity-card-migration.md`), since Ammo has no editable track UI of its own.
 */
export const CardElementAmmo: FC<CardElementAmmoProps> = ({ value }) => {
  if (value === undefined) return null
  return <CardElementStat label="Ammo" value={`${value.remaining}/${value.size}`} />
}

CardElementAmmo.displayName = "WeaponCard.Ammo"
