import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import {
  defaultGearSubmitMeta,

} from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { FirearmData, MeleeWeaponData, WeaponData } from "#/lib/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/lib/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/lib/system/gear/weapons/firearms/firearmTypeKey.ts"
import { GearType } from "#/lib/system/gearType.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export interface WeaponFormOptions {
  weapon?: WeaponData
  onSubmit: (weapon: WeaponData, meta: GearSubmitMeta) => void
}

// Unified form state that accommodates all weapon subtypes so a single form
// can handle melee, firearms, thrown, and projectile weapons.
const defaultFormValues = {
  id: NullUuid,
  itemType: GearType.weapon,
  name: "",
  weaponType: WeaponType.firearm,
  dmg: "",
  ap: 0,
  skill: "",
  attribute: "",
  cost: 0,
  description: "",
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  quantity: 1,

  // MeleeWeaponData-specific
  reach: 0,

  // FirearmData-specific
  firearmType: FirearmTypeKey.assaultRifle,
  firemodes: ["SA", "B", "FA"],
  attachmentPoints: [
    FirearmAttachmentPoint.Top,
    FirearmAttachmentPoint.Barrel,
    FirearmAttachmentPoint.Under,
  ],
  recoil: 0,
  ammo: {
    size: 0,
    remaining: 0,
    type: "clip",
  },
}

export type WeaponFormState = typeof defaultFormValues

export const weaponFieldMap = createFieldMap(defaultFormValues)

export const weaponFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

/**
 * Converts the unified weapon form state to the appropriate typed WeaponData subtype.
 * Optional fields (ap, skill, attribute) are omitted when empty/zero to keep the
 * stored data clean. Type-specific fields (reach, firemodes, etc.) are only included
 * when the weaponType matches.
 */
function toWeaponData(values: WeaponFormState): WeaponData {
  const base = {
    id: values.id,
    itemType: GearType.weapon as typeof GearType.weapon,
    name: values.name,
    weaponType: values.weaponType,
    dmg: values.dmg,
    ...(values.ap !== 0 && { ap: values.ap }),
    ...(values.skill && { skill: values.skill }),
    ...(values.attribute && { attribute: values.attribute as WeaponData["attribute"] }),
    cost: values.cost,
    description: values.description,
    availability: values.availability,
    source: values.source,
    quantity: values.quantity,
  }

  if (values.weaponType === WeaponType.firearm) {
    return {
      ...base,
      weaponType: WeaponType.firearm,
      firearmType: values.firearmType,
      firemodes: values.firemodes,
      attachmentPoints: values.attachmentPoints as FirearmAttachmentPoint[],
      recoil: values.recoil,
      ammo: {
        size: values.ammo.size,
        remaining: values.ammo.remaining,
        type: values.ammo.type as FirearmData["ammo"]["type"],
      },
    } as FirearmData
  }

  if (values.weaponType === WeaponType.melee) {
    return {
      ...base,
      weaponType: WeaponType.melee,
      reach: values.reach,
    } as MeleeWeaponData
  }

  return base as WeaponData
}

export const useWeaponForm = ({ weapon, onSubmit }: WeaponFormOptions) => {
  const firearmWeapon =
    weapon?.weaponType === WeaponType.firearm ? (weapon as FirearmData) : undefined
  const meleeWeapon =
    weapon?.weaponType === WeaponType.melee ? (weapon as MeleeWeaponData) : undefined

  const defaults: WeaponFormState = weapon
    ? {
        ...defaultFormValues,
        id: weapon.id,
        name: weapon.name,
        weaponType: weapon.weaponType,
        dmg: weapon.dmg,
        ap: weapon.ap ?? 0,
        skill: weapon.skill ?? "",
        attribute: weapon.attribute ?? "",
        cost: weapon.cost ?? 0,
        description: weapon.description ?? "",
        availability: {
          rating: weapon.availability?.rating ?? 0,
          restricted: weapon.availability?.restricted ?? false,
          forbidden: weapon.availability?.forbidden ?? false,
        },
        source: {
          book: weapon.source?.book ?? "",
          page: weapon.source?.page ?? 0,
        },
        quantity: weapon.quantity ?? 1,
        reach: meleeWeapon?.reach ?? 0,
        firearmType: firearmWeapon?.firearmType ?? FirearmTypeKey.lightPistol,
        firemodes: firearmWeapon?.firemodes ?? [],
        attachmentPoints: firearmWeapon?.attachmentPoints ?? [],
        recoil: firearmWeapon?.recoil ?? 0,
        ammo: firearmWeapon?.ammo ?? defaultFormValues.ammo,
      }
    : {
        ...defaultFormValues,
      }

  return useAppForm({
    ...weaponFormOpts,
    defaultValues: defaults,
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(toWeaponData(value), meta),
  })
}
