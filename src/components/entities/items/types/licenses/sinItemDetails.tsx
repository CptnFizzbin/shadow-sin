import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"

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
  const licenses = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: sin.id })
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
          value={sin.isReal ? "Real" : (sin.rating ?? 0)}
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

      {confirmDialog.outlet}
      {sinFormDialog.outlet}
      {licenseFormDialog.outlet}
    </>
  )
}
