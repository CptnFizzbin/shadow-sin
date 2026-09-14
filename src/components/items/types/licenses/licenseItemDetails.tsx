import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { useLicenseFormDialog } from "./dialogs/licenseFormDialog.tsx"

export interface LicenseItemDetailsProps {
  license: LicenseData
  onRemoved?: () => void
}

export const LicenseItemDetails: FC<LicenseItemDetailsProps> = ({ license, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const licenseFormDialog = useLicenseFormDialog()
  const sin = useRunnerSelector(ItemSelectors.selectById, { itemId: license.items.parentId as UUID }) as SinData | undefined

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
          value={license.isReal ? "Real" : (license.rating ?? 0)}
          type="rating"
        />
      </ItemDetailsRoot>

      {licenseFormDialog.outlet}
    </>
  )
}
