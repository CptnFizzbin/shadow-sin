import pluralize from "pluralize"

import {
  GearBuildPointAllowance,
  GearNuyenAllowance,
  useGearBuildPoints,
} from "#/components/builder/buildPoints/hooks/useGearBuildPoints.ts"
import { useGearAvailabilityIssues } from "#/components/builder/sections/gear/gearUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

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
