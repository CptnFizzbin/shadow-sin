import { GearSection } from "#app/components/entities/items/viewer/gearSectionTypes.ts"
import type { ConsumableType } from "#data/items/consumableData.ts"
import type { MagicalType } from "#data/items/magicalData.ts"
import type { VehicleCategory } from "#data/items/vehicleData.ts"
import type { WeaponType } from "#data/items/weaponData.ts"

/**
 * The kind of License gear the "SINs & Licenses" category resolves to — a SIN
 * itself, or a License (which attaches to a SIN once created).
 */
export type LicenseKind = "sin" | "license"

/** Categories with more than one concrete gear type reachable from the Add Item workflow. */
export type AddItemSectionWithSubtype =
  | GearSection.Weapons
  | GearSection.Vehicles
  | GearSection.Licenses
  | GearSection.Consumables
  | GearSection.Magical

/**
 * Resolved from the Add Item workflow's Select Type / Select Subtype steps —
 * which gear category, and (where the category has more than one concrete gear
 * type) which one, to open the Enter Stats step for.
 */
export type AddItemSelection =
  | { section: GearSection.Weapons, weaponType: WeaponType }
  | { section: GearSection.Vehicles, vehicleCategory: VehicleCategory }
  | { section: GearSection.Licenses, licenseKind: LicenseKind }
  | { section: GearSection.Consumables, consumableType: ConsumableType }
  | { section: GearSection.Magical, magicalType: MagicalType }
  | { section: Exclude<GearSection, AddItemSectionWithSubtype> }

export function sectionHasSubtypeStep(section: GearSection): section is AddItemSectionWithSubtype {
  return section === GearSection.Weapons
    || section === GearSection.Vehicles
    || section === GearSection.Licenses
    || section === GearSection.Consumables
    || section === GearSection.Magical
}
