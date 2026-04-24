import { SectionHeader } from "#/components/builder/sections/gear/sectionHeader.tsx"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { getLicenseAvailability } from "#/components/items/types/licenses/licenseUtils.ts"
import { getSinAvailability } from "#/components/items/types/licenses/sinUtils.ts"
import { isImplant } from "#/system/gear/implantData.ts"
import { isLicenseData } from "#/system/gear/licenseData.ts"
import { isSinData } from "#/system/gear/sinData.ts"

type ItemCostInfo = {
  cost?: number
  quantity?: number
}

export const getTotalCost = (...items: ItemCostInfo[]) => {
  return items
    .map((item) => ({
      cost: item.cost ?? 0,
      quantity: item.quantity ?? 1,
    }))
    .map(({ cost, quantity }) => cost * quantity)
    .reduce((sum, itemCost) => sum + itemCost, 0)
}

export const useGearAvailabilityIssues = () => {
  const gear = useCharacterSheet((state) => state.gear)
  const allGear = Object.values(gear)

  const invalidSections = new Set<SectionHeader>()
  let totalInvalidCount = 0

  const genericSectionKeys: Partial<
    Record<SectionHeader, "weapons" | "armor" | "vehicles" | "devices" | "misc">
  > = {
    [SectionHeader.Weapons]: "weapons",
    [SectionHeader.Armor]: "armor",
    [SectionHeader.Vehicles]: "vehicles",
    [SectionHeader.Devices]: "devices",
    [SectionHeader.Misc]: "misc",
  }

  Object.values(SectionHeader).forEach((sectionName) => {
    if (sectionName === SectionHeader.Licenses) {
      const sins = allGear.filter(isSinData)
      const licenses = allGear.filter(isLicenseData)

      const sinInvalid = sins.some((s) => getSinAvailability(s.rating).rating > GearMaxAvailability)
      const licInvalid = licenses.some((l) => getLicenseAvailability(l.rating).rating > GearMaxAvailability)

      if (sinInvalid || licInvalid) {
        invalidSections.add(sectionName)
        totalInvalidCount += sins.filter((s) => getSinAvailability(s.rating).rating > GearMaxAvailability).length + licenses.filter((l) => getLicenseAvailability(l.rating).rating > GearMaxAvailability).length
      }
    } else if (sectionName === SectionHeader.Cyberware) {
      const invalidImplants = allGear.filter(isImplant)
        .filter((implant) => (implant.availability?.rating ?? Number.NEGATIVE_INFINITY) > GearMaxAvailability)
      if (invalidImplants.length > 0) {
        invalidSections.add(sectionName)
        totalInvalidCount += invalidImplants.length
      }
    } else if (sectionName === SectionHeader.Lifestyle) {
      // no availability to check
    } else {
      const sectionKey = genericSectionKeys[sectionName]
      if (sectionKey) {
        const items = allGear.filter((i) => i.itemType === sectionKey)
        const invalidItems = items.filter((it) => (it.availability?.rating ?? Number.NEGATIVE_INFINITY) > GearMaxAvailability)
        if (invalidItems.length > 0) {
          invalidSections.add(sectionName)
          totalInvalidCount += invalidItems.length
        }
      }
    }
  })

  return { invalidSections, totalInvalidCount }
}
