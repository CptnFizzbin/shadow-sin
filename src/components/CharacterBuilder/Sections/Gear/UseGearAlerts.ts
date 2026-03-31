import pluralize from "pluralize"

import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import {
  GearBuildPointAllowance,
  GearNuyenAllowance,
  useGearBuildPoints,
} from "#/components/CharacterBuilder/BuildPoints/Hooks/UseGearBuildPoints.ts"
import { useGearAvailabilityIssues } from "#/components/CharacterBuilder/Sections/Gear/GearUtils.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useGearAlerts = (): AlertInfo[] => {
  const { totalInvalidCount } = useGearAvailabilityIssues()
  const { isOverBudget } = useGearBuildPoints()

  const alerts: AlertInfo[] = []

  if (isOverBudget) {
    alerts.push({
      section: "Gear",
      severity: "error",
      title: "Budget Exceeded",
      message: `Gear budget exceeded! Maximum is ${GearNuyenAllowance.toLocaleString()} (${GearBuildPointAllowance} BP).`,
    })
  }

  if (totalInvalidCount > 0) {
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "Availability",
      message: `${totalInvalidCount} ${pluralize("gear item", totalInvalidCount)} exceed the maximum availability. Check highlighted items.`,
    })
  }

  const gear = useCharacterSheet((s) => s.gear)
  if (Object.keys(gear).length === 0) {
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "No gear selected",
      message: "No gear has been added. Consider purchasing equipment or lifestyle upgrades.",
      summaryOnly: true,
    })
  }

  return alerts
}
