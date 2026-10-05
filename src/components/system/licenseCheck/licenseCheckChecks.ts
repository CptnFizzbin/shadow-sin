import type { ItemData } from "#/system/model/items/itemData.ts"
import { ArrayUtils } from "#/utils/arrayUtils.ts"

import { buildVerificationLanes, resolveActiveSinId } from "./licenseCheckLanes.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

/**
 * Flattens the Setup screen's SIN / Unlicensed / Forbidden lanes into the shuffled, checked-only
 * queue a scan actually works through (per-worker order, not per-SIN grouping). A SIN's own
 * credential is kept when its own checkbox is checked, or when at least one of its licensed gear
 * checks is still checked — presenting a piece of gear implies presenting the identity backing it
 * — so a SIN can be verified either standalone or through its gear. Every other check is kept only
 * when it's checked itself.
 */
export function buildVerificationChecks(
  gear: Record<string, ItemData>,
  checkedItems: ItemData[],
  activeSinId?: string,
): VerificationCheck[] {
  const checkedIds = new Set<string>(checkedItems.map((item) => item.id))
  const lanes = buildVerificationLanes(gear, activeSinId)
  const resolvedActiveSinId = resolveActiveSinId(gear, activeSinId)

  const checks: VerificationCheck[] = []
  for (const lane of lanes) {
    const [firstCheck, ...restChecks] = lane.checks
    if (firstCheck.kind === "sin") {
      if (lane.key !== resolvedActiveSinId) continue
      const checkedGear = restChecks.filter((check) => checkedIds.has(check.itemId))
      if (!checkedIds.has(firstCheck.itemId) && checkedGear.length === 0) continue
      checks.push(firstCheck, ...checkedGear)
    } else {
      checks.push(...lane.checks.filter((check) => checkedIds.has(check.itemId)))
    }
  }

  return ArrayUtils.shuffle(checks)
}
