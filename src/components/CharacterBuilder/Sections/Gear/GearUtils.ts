import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { getLicenseAvailability } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/LicenseUtils.ts"
import { getSinAvailability } from "#/components/CharacterBuilder/Sections/Gear/Licenses/SinUtils.ts"
import { SectionHeader } from "#/components/CharacterBuilder/Sections/Gear/SectionHeader.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/SummaryLineItem.ts"
import { Lifestyles, LifestyleType } from "#/lib/system/LifestyleType.ts"
import { isSinData } from "#/lib/system/gear/SinData.ts"
import { isImplant } from "#/lib/system/gear/implantData.ts"
import { isLicenseData } from "#/lib/system/gear/licenseData.ts"

export const GearBuildPointAllowance = 50
export const GearNuyenPerBuildPoint = 5_000
export const GearNuyenAllowance =
  GearNuyenPerBuildPoint * GearBuildPointAllowance
export const GearMaxAvailability = 12

export type GearItemCostInfo = {
  cost?: number
  quantity?: number
}

export const getTotalCost = (...items: GearItemCostInfo[]) => {
  return items
    .map((item) => ({
      cost: item.cost ?? 0,
      quantity: item.quantity ?? 1,
    }))
    .map(({ cost, quantity }) => cost * quantity)
    .reduce((sum, itemCost) => sum + itemCost, 0)
}

export const useGearTotalCost = () => {
  const gear = useCharacterSheet((state) => state.gear)
  const allGear = Object.values(gear)

  const lifestyle = useCharacterSheet((state) => {
    const lifestyleType = state.profile.lifestyle?.quality ?? LifestyleType.Street
    return Lifestyles[lifestyleType]
  })
  const lifestyleMonths = useCharacterSheet(
    (state) => state.profile.lifestyle?.monthsPaid ?? 1,
  )

  const gearCost = getTotalCost(...allGear)

  const lifestyleCost = lifestyle.upkeep * lifestyleMonths
  return gearCost + lifestyleCost
}

export const useGearBuildPoints = (): BpLineItem => {
  const gearNuyenCost = useGearTotalCost()
  const gearBuildPoints = Math.ceil(gearNuyenCost / GearNuyenPerBuildPoint)

  return {
    label: "Gear",
    spent: gearBuildPoints,
    allowance: GearBuildPointAllowance,
    isOverBudget: gearBuildPoints > GearBuildPointAllowance,
  }
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
