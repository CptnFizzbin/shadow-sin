import { useGearByType } from "#/components/items/gearHooks.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { useQuickBuyLicenseDialog } from "./dialogs/quickBuyLicenseDialog.tsx"
import { isItemLicensed, isLicenseQuickBuyEligible } from "./licenseUtils.ts"

/**
 * Drives the Licence Quick-Buy action for a single gear item: whether the trigger should be
 * shown (Restricted, not already covered by a Licence) and the dialog that buys one.
 */
export function useQuickBuyLicenseAction(item: ItemData) {
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const quickBuyLicenseDialog = useQuickBuyLicenseDialog()

  const eligible = isLicenseQuickBuyEligible(item) && !isItemLicensed(item, licenses)

  return {
    eligible,
    open: () => quickBuyLicenseDialog.open({ item }),
    dialog: quickBuyLicenseDialog.dialog,
  }
}
