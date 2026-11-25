import type { FC } from "react"

import { useEditItemDialog } from "#app/components/entities/items/actions/useEditItemDialog.tsx"
import { ItemCardGrid } from "#app/components/entities/items/card/itemCardGrid.tsx"
import { useGearListView } from "#app/components/entities/items/viewer/gearListFilter.ts"
import { useOpenItemDetails } from "#app/hooks/items/useOpenItemDetails.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { LicenseData } from "#data/items/licenseData.ts"
import type { SinData } from "#data/items/sinData.ts"
import { useGearByType } from "#state/runner/items/gearHooks.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useConfirmDialog } from "#ui/dialog/confirmDialog.tsx"

import { useSinFormDialog } from "./dialogs/sinFormDialog.tsx"
import { LicenseDataCard } from "./licenseDataCard.tsx"
import { SinDataCard } from "./sinDataCard.tsx"

export const SinsAndLicensesSection: FC = () => {
  const confirmDialog = useConfirmDialog()
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const sinFormDialog = useSinFormDialog()
  const editItemDialog = useEditItemDialog()
  const gearListView = useGearListView()

  // A Licence whose parent isn't a SIN in gear (never attached, or its SIN was removed without
  // its children) would otherwise appear nowhere, since Licences only render nested under a SIN card.
  const unattachedLicenses = licenses.filter((license) =>
    !sins.some((sin) => sin.id === license.items.parentId))

  const saveItem = (item: SinData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const handleRemoveSin = async (sin: SinData, hasLicenses: boolean) => {
    if (hasLicenses) {
      const confirmed = await confirmDialog.confirm({
        title: `Remove SIN "${sin.name}"?`,
        body: "This will also remove all associated licenses.",
        confirmLabel: "Remove SIN",
      })
      if (!confirmed) return
    }
    dispatch(Actions.item.removeItem({ id: sin.id, removeChildren: true }))
  }

  const handleEditSin = async (sin?: SinData) => {
    const saved = await sinFormDialog.open({
      sin,
      onDelete: sin
        ? () => {
            const sinLicenses = licenses.filter((l) => l.items.parentId === sin.id)
            void handleRemoveSin(sin, sinLicenses.length > 0)
          }
        : undefined,
    })
    if (saved) saveItem(saved)
  }

  return (
    <>
      <ItemCardGrid>
        {gearListView(sins).map((sin) => (
          <SinDataCard
            key={sin.id}
            sin={sin}
            onOpen={openItemDetails ? () => openItemDetails(sin.id) : () => handleEditSin(sin)}
            onEdit={openItemDetails ? () => handleEditSin(sin) : undefined}
          />
        ))}

        {gearListView(unattachedLicenses).map((license) => (
          <LicenseDataCard
            key={license.id}
            license={license}
            onOpen={openItemDetails ? () => openItemDetails(license.id) : () => editItemDialog.open(license)}
            onEdit={openItemDetails ? () => editItemDialog.open(license) : undefined}
          />
        ))}
      </ItemCardGrid>

      {confirmDialog.outlet}
      {sinFormDialog.outlet}
      {editItemDialog.outlet}
    </>
  )
}
