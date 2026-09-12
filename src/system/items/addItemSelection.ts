import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import type { VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { WeaponType } from "#/system/gear/weaponData.ts"

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

/**
 * Resolved from the Add Item workflow's Select Type / Select Subtype steps —
 * which gear category, and (where the category has more than one concrete gear
 * type) which one, to open the Enter Stats step for.
 */
export type AddItemSelection =
  | { section: GearSection.Weapons, weaponType: WeaponType }
  | { section: GearSection.Vehicles, vehicleCategory: VehicleCategory }
  | { section: GearSection.Licenses, licenseKind: LicenseKind }
  | { section: Exclude<GearSection, AddItemSectionWithSubtype> }

export function sectionHasSubtypeStep(section: GearSection): section is AddItemSectionWithSubtype {
  return section === GearSection.Weapons
    || section === GearSection.Vehicles
    || section === GearSection.Licenses
}
