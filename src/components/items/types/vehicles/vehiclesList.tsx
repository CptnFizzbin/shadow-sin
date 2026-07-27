import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useGearFilter } from "#/lib/hooks/items/gearHooks.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"
import { VehicleItemCard } from "./vehicleItemCard.tsx"

interface VehiclesListProps {
  vehicleCategory: VehicleCategory
}

export const VehiclesList: FC<VehiclesListProps> = ({ vehicleCategory }) => {
  const dispatch = useRunnerStoreDispatch()
  const vehicleFormDialog = useVehicleFormDialog()
  const attachmentFormDialog = useItemFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))
  const removeItem = (item: ItemData) => dispatch(Actions.gear.removeItem({ id: item.id }))

  const vehicles = useGearFilter(
    (item): item is VehicleData =>
      isVehicleData(item) && item.vehicleCategory === vehicleCategory,
  )

  const allAttachments = useGearFilter(
    (item): item is ItemData => !isVehicleData(item) && !!item.parentId,
  )

  const getAttachments = (vehicleId: string) =>
    allAttachments.filter((item) => item.parentId === vehicleId)

  const categoryLabel = vehicleCategory === VehicleCategory.drone ? "Drone" : "Vehicle"

  const handleEditVehicle = async (vehicle?: VehicleData) => {
    const saved = await vehicleFormDialog.open({ vehicle, vehicleCategory })
    if (saved) saveItem(saved)
  }

  const handleAddAttachment = async (parentId: UUID) => {
    const saved = await attachmentFormDialog.open({ label: "Equipment" })
    if (saved) saveItem({ ...saved, parentId })
  }

  const handleEditAttachment = async (attachment: ItemData) => {
    const saved = await attachmentFormDialog.open({ item: attachment, label: "Equipment" })
    if (saved) saveItem(saved)
  }

  const handleDamageChange = (vehicle: VehicleData, current: number) => {
    const max = vehicle.damage?.physical.max || vehicle.body
    const updated: VehicleData = { ...vehicle, damage: { physical: { current, max } } }
    saveItem(updated)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {vehicles.map((vehicle) => {
        const attachments = getAttachments(vehicle.id)

        return (
          <VehicleItemCard
            key={vehicle.id}
            vehicle={vehicle}
            attachments={attachments}
            onEdit={() => handleEditVehicle(vehicle)}
            onRemove={() => removeItem(vehicle)}
            onAddAttachment={() => handleAddAttachment(vehicle.id as UUID)}
            onEditAttachment={(attachment) => handleEditAttachment(attachment)}
            onRemoveAttachment={(attachment) => removeItem(attachment)}
            onDamageChange={(value) => handleDamageChange(vehicle, value)}
          />
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditVehicle()}
        color="secondary"
        fullWidth
      >
        Add {categoryLabel}
      </Button>

      {vehicleFormDialog.dialog}
      {attachmentFormDialog.dialog}
    </Stack>
  )
}
