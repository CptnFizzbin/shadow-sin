import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
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
  const sin = useRunnerStoreSelector(Selectors.gear.selectById(license.parentId as UUID)) as SinData | undefined

  const removeLicense = () => {
    dispatch(Actions.gear.licenses.destroy(license.id))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await licenseFormDialog.open({ sin, license })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <BasicItemDetails item={license} onEdit={handleEdit} onRemove={removeLicense}>
        <ItemDetailsSlot.Stat
          label="Rating"
          value={license.rating === "real" ? "Real" : license.rating}
          type="rating"
        />
      </BasicItemDetails>

      {licenseFormDialog.dialog}
    </>
  )
}
