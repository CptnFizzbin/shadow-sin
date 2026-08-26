import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

import { useSinFormDialog } from "./dialogs/sinFormDialog.tsx"
import { SinDataCard } from "./sinDataCard.tsx"

export const SinsAndLicensesSection: FC = () => {
  const confirmDialog = useConfirmDialog()
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const sinFormDialog = useSinFormDialog()

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
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditSin()}
        fullWidth
      >
        Add SIN
      </Button>

      {sins.map((sin) => (
        <SinDataCard
          key={sin.id}
          sin={sin}
          onOpen={openItemDetails ? () => openItemDetails(sin.id) : () => handleEditSin(sin)}
          onEdit={openItemDetails ? () => handleEditSin(sin) : undefined}
        />
      ))}

      {confirmDialog.outlet}
      {sinFormDialog.outlet}
    </>
  )
}
