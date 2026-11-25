import pluralize from "pluralize"

import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { getBondedFociLimits } from "#/system/formulas/magic/focusRules.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { isFocusData } from "#/system/model/items/magicalData.ts"

/**
 * Warnings for a Runner whose Bonded foci break the Bonded Foci Limit (no more foci than their
 * Magic) or the Foci Force Limit (no more combined Force than Magic × 5).
 */
export function useFociAlerts(): AlertInfo[] {
  const magicalItems = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.magical })
  const magic = useRunnerSelector(AttrSelectors.selectRating, { attr: AttributeKey.magic })

  const limits = getBondedFociLimits(Object.values(magicalItems).filter(isFocusData), magic)
  const alerts: AlertInfo[] = []

  if (limits.isOverCountLimit) {
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "Too Many Bonded Foci",
      message: `${limits.bondedCount} ${pluralize("focus", limits.bondedCount)} bonded, but Magic ${magic} allows at most ${limits.maxBondedCount}.`,
    })
  }

  if (limits.isOverForceLimit) {
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "Bonded Foci Force",
      message: `Bonded foci total Force ${limits.totalForce}, but Magic ${magic} allows at most ${limits.maxTotalForce} (Magic × 5).`,
    })
  }

  return alerts
}
