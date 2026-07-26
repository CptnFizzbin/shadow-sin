import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useQuickBuyLicenseDialog } from "./dialogs/quickBuyLicenseDialog.tsx"
import { isLicenseQuickBuyEligible } from "./licenseUtils.ts"

/**
 * Drives the Licence Quick-Buy action for a single gear item: whether the trigger should be
 * shown (Restricted, not already covered by a Licence) and the dialog that buys one.
 */
export function useQuickBuyLicenseAction(item: ItemData) {
  const license = useRunnerStoreSelector(Selectors.gear.licenses.selectForItem(item.id))
  const quickBuyLicenseDialog = useQuickBuyLicenseDialog()

  const eligible = isLicenseQuickBuyEligible(item) && !license

  return {
    eligible,
    open: () => quickBuyLicenseDialog.open({ item }),
    dialog: quickBuyLicenseDialog.dialog,
  }
}
