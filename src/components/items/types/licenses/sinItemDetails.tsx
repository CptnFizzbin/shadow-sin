import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useLicenseFormDialog } from "./dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "./dialogs/sinFormDialog.tsx"

export interface SinItemDetailsProps {
  sin: SinData
  onRemoved?: () => void
  /** Called with a license when its nested subitem card is tapped, to navigate to its own details page. */
  onOpenAttachment?: (item: ItemData) => void
}

export const SinItemDetails: FC<SinItemDetailsProps> = ({ sin, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()
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
    dispatch(Actions.item.removeItem({ id: sin.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await sinFormDialog.open({ sin })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddLicense = async () => {
    const saved = await licenseFormDialog.open({ sin })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <>
      <ItemDetailsRoot
        item={sin}
        onEdit={handleEdit}
        onRemove={removeSin}
        subitemsName="Licenses"
        onAddSubitem={handleAddLicense}
      >
        <ItemDetailsSlot.Stat
          label="Rating"
          value={sin.rating === "real" ? "Real" : sin.rating}
          type="rating"
        />

        {Object.values(licenses).map((license) => (
          <ItemDetailsSlot.Subitem
            key={license.id}
            item={license}
            onOpen={onOpenAttachment ? () => onOpenAttachment(license) : undefined}
          />
        ))}
      </ItemDetailsRoot>

      {confirmDialog.dialog}
      {sinFormDialog.dialog}
      {licenseFormDialog.dialog}
    </>
  )
}
