import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SinData } from "#/system/gear/sinData.ts"

import { useSinFormDialog } from "./dialogs/sinFormDialog.tsx"

export interface SinItemDetailsProps {
  sin: SinData
  onRemoved?: () => void
}

/**
 * Licenses belonging to this SIN aren't rendered here — mirrors SinCard,
 * which leaves them to the containing section so each stays individually
 * tappable rather than becoming a read-only subitem row.
 */
export const SinItemDetails: FC<SinItemDetailsProps> = ({ sin, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const sinFormDialog = useSinFormDialog()
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
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await sinFormDialog.open({ sin })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <BasicItemDetails item={sin} onEdit={handleEdit} onRemove={removeSin}>
        <ItemDetailsSlot.Stat
          label="Rating"
          value={sin.rating === "real" ? "Real" : sin.rating}
          type="rating"
        />
      </BasicItemDetails>

      {confirmDialog.dialog}
      {sinFormDialog.dialog}
    </>
  )
}
