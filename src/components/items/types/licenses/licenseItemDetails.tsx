import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import type { UUID } from "#/lib/uuidUtils.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

import { useLicenseFormDialog } from "./dialogs/licenseFormDialog.tsx"

export interface LicenseItemDetailsProps {
  license: LicenseData
  onRemoved?: () => void
}

export const LicenseItemDetails: FC<LicenseItemDetailsProps> = ({ license, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const licenseFormDialog = useLicenseFormDialog()
  const sin = useRunnerStoreSelector(Selectors.gear.selectById(license.items.parentId as UUID)) as SinData | undefined

  const removeLicense = () => {
    dispatch(Actions.item.licenses.destroy(license.id))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await licenseFormDialog.open({ sin, license })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <>
      <ItemDetailsRoot item={license} onEdit={handleEdit} onRemove={removeLicense}>
        <ItemDetailsSlot.Stat
          label="Rating"
          value={license.rating === "real" ? "Real" : license.rating}
          type="rating"
        />
      </ItemDetailsRoot>

      {licenseFormDialog.outlet}
    </>
  )
}
