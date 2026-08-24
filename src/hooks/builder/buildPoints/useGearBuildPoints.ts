import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getTotalCost } from "#/components/builder/sections/gear/gearUtils.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

type GearTotalCostState = { runner: RunnerData } & { items: ItemCatalog }

export const selectGearTotalCost: Selector<GearTotalCostState, number> = createMemoizedSelector(
  ItemSelectors.selectAll,
  ProfileSelectors.selectLifestyleQuality,
  ProfileSelectors.selectLifestyleMonthsPaid,
  (gear, lifestyleQuality, lifestyleMonthsPaid) => {
    const lifestyle = Lifestyles[lifestyleQuality ?? LifestyleType.Street]
    const lifestyleMonths = lifestyleMonthsPaid ?? 1

    const gearCost = getTotalCost(...Object.values(gear))
    const lifestyleCost = lifestyle.upkeep * lifestyleMonths
    return gearCost + lifestyleCost
  },
)

export const selectGearBuildPoints: Selector<GearTotalCostState, BpLineItem> = createMemoizedSelector(
  selectGearTotalCost,
  (gearNuyenCost): BpLineItem => {
    const gearBuildPoints = Math.ceil(gearNuyenCost / BuilderConfig.gear.nuyenPerBp)

    return {
      sectionId: BuilderSectionId.gear,
      spent: gearBuildPoints,
      allowance: BuilderConfig.gear.bpAllowance,
      isOverBudget: gearBuildPoints > BuilderConfig.gear.bpAllowance,
    }
  },
)
