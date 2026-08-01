import type { FC } from "react"

import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinDataCardProps {
  sin: SinData
  onOpen?: () => void
  onEdit?: () => void
}

/**
 * Licenses are shown as their own interactive cards nested below the SIN by
 * the containing section (see SinsAndLicensesSection / LicensesSectionContent),
 * not as read-only subitems here — unlike accessories on other item types,
 * each license needs to stay individually tappable to edit.
 */
export const SinDataCard: FC<SinDataCardProps> = ({ sin, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const licenses = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(sin.id))
  const hasLicenses = Object.keys(licenses).length > 0

  const removeSin = async () => {
    if (hasLicenses) {
      const confirmed = await confirmDialog.confirm({
        title: `Remove SIN "${sin.name}"?`,
        body: "This will also remove all associated licenses.",
        confirmLabel: "Remove SIN",
      })
      if (!confirmed) return
    }
    dispatch(Actions.gear.removeItem({ id: sin.id, removeChildren: true }))
  }

  return (
    <>
      <ItemDataCardRoot item={sin} onOpen={onOpen} onEdit={onEdit} onRemove={removeSin} />

      {confirmDialog.dialog}
    </>
  )
}
