import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { FirearmData, MeleeWeaponData, WeaponData, MeleeWeaponType } from "#/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import { ItemType } from "#/system/itemType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export interface WeaponFormOptions {
  weapon?: WeaponData
  onSubmit: (weapon: WeaponData, meta: GearSubmitMeta) => void
}

// Unified form state that accommodates all weapon subtypes so a single form
// can handle melee, firearms, thrown, and projectile weapons.
const defaultFormValues = {
  id: NullUuid,
  itemType: ItemType.weapon,
  name: "",
  weaponType: WeaponType.firearm,
  dmg: "",
  dmgType: "physical" as "physical" | "stun" | "custom",
  dmgValue: 0,
  ap: 0,
  skill: SkillKey.automatics as SkillKey,
  attribute: AttributeKey.agility as AttributeKey | "",
  cost: 0,
  description: "",
  equipped: false,
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
  rating: undefined as number | undefined,

  // MeleeWeaponData-specific
  reach: 0,
  meleeType: undefined as MeleeWeaponType | undefined,

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
    itemType: ItemType.weapon as typeof ItemType.weapon,
    name: values.name,
    weaponType: values.weaponType,
    dmg: values.dmgType === "custom" ? values.dmg : String(values.dmgValue),
    dmgType: values.dmgType,
    equipped: values.equipped,
    ...(values.ap !== 0 && { ap: values.ap }),
    skill: values.skill as SkillKey,
    ...(values.attribute && { attribute: values.attribute as WeaponData["attribute"] }),
    cost: values.cost,
    description: values.description,
    availability: values.availability,
    source: values.source,
    quantity: values.quantity,
    ...(values.rating !== undefined && { rating: values.rating }),
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
      ...(values.meleeType !== undefined && { meleeType: values.meleeType }),
    } as MeleeWeaponData
  }

  return base as WeaponData
}

function weaponToFormState(weapon: WeaponData): WeaponFormState {
  const firearmWeapon = weapon.weaponType === WeaponType.firearm ? (weapon as FirearmData) : undefined
  const meleeWeapon = weapon.weaponType === WeaponType.melee ? (weapon as MeleeWeaponData) : undefined

  return {
    ...defaultFormValues,
    id: weapon.id,
    name: weapon.name,
    weaponType: weapon.weaponType,
    dmg: weapon.dmgType === "custom" ? weapon.dmg : "",
    dmgType: weapon.dmgType ?? "physical",
    dmgValue: weapon.dmgType !== "custom" ? (Number.parseInt(weapon.dmg, 10) || 0) : 0,
    ap: weapon.ap ?? 0,
    skill: weapon.skill,
    attribute: weapon.attribute ?? (weapon.weaponType === WeaponType.firearm ? AttributeKey.agility : ""),
    cost: weapon.cost ?? 0,
    description: weapon.description ?? "",
    equipped: weapon.equipped ?? false,
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
    rating: typeof weapon.rating === "number" ? weapon.rating : undefined,
    reach: meleeWeapon?.reach ?? 0,
    meleeType: meleeWeapon?.meleeType,
    firearmType: firearmWeapon?.firearmType ?? FirearmTypeKey.lightPistol,
    firemodes: firearmWeapon?.firemodes ?? [],
    attachmentPoints: firearmWeapon?.attachmentPoints ?? [],
    recoil: firearmWeapon?.recoil ?? 0,
    ammo: firearmWeapon?.ammo ?? defaultFormValues.ammo,
  }
}

export const useWeaponForm = ({ weapon, onSubmit }: WeaponFormOptions) => {
  return useItemForm<WeaponFormState>({
    item: weapon ? weaponToFormState(weapon) : undefined,
    defaultValues: defaultFormValues,
    onSubmit: (formState, meta) => onSubmit(toWeaponData(formState), meta),
  })
}
