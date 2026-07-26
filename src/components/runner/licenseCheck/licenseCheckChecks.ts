import { ArrayUtils } from "#/lib/arrayUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

import { buildVerificationLanes } from "./licenseCheckLanes.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

/**
 * Flattens the Setup screen's SIN / Unlicensed / Forbidden lanes into the shuffled, checked-only
 * queue a scan actually works through (per-worker order, not per-SIN grouping). A SIN's own
 * credential is kept only when at least one of its licensed gear checks is still checked — SINs
 * have no checkbox of their own — every other check is kept only when it's checked itself.
 */
export function buildVerificationChecks(
  gear: Record<string, ItemData>,
  checkedItems: ItemData[],
): VerificationCheck[] {
  const checkedIds = new Set<string>(checkedItems.map((item) => item.id))
  const lanes = buildVerificationLanes(gear)

  const checks: VerificationCheck[] = []
  for (const lane of lanes) {
    const [firstCheck, ...restChecks] = lane.checks
    if (firstCheck.kind === "sin") {
      const checkedGear = restChecks.filter((check) => checkedIds.has(check.itemId))
      if (checkedGear.length === 0) continue
      checks.push(firstCheck, ...checkedGear)
    } else {
      checks.push(...lane.checks.filter((check) => checkedIds.has(check.itemId)))
    }
  }

  return ArrayUtils.shuffle(checks)
}
