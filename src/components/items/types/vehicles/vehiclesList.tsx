import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { ItemDataCard } from "#/components/itemCard/itemDataCard.tsx"
import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useGearFilter } from "#/lib/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/lib/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"
import { VehicleDataCard } from "./vehicleDataCard.tsx"

interface VehiclesListProps {
  vehicleCategory: VehicleCategory
}

export const VehiclesList: FC<VehiclesListProps> = ({ vehicleCategory }) => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
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

  return (
    <Stack sx={{ gap: 1 }}>
      {vehicles.map((vehicle) => {
        const attachments = getAttachments(vehicle.id)

        return (
          <Stack key={vehicle.id} sx={{ gap: 1 }}>
            <VehicleDataCard
              vehicle={vehicle}
              onOpen={openItemDetails
                ? () => openItemDetails(vehicle.id)
                : () => handleEditVehicle(vehicle)}
              onEdit={openItemDetails ? () => handleEditVehicle(vehicle) : undefined}
            />

            {attachments.length > 0 && (
              <Stack sx={{ gap: 1, pl: 2 }}>
                {attachments.map((attachment) => (
                  <ItemDataCard
                    key={attachment.id}
                    item={attachment}
                    onOpen={openItemDetails
                      ? () => openItemDetails(attachment.id)
                      : () => handleEditAttachment(attachment)}
                    onEdit={openItemDetails ? () => handleEditAttachment(attachment) : undefined}
                    onRemove={() => removeItem(attachment)}
                  />
                ))}
              </Stack>
            )}

            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={() => handleAddAttachment(vehicle.id as UUID)}
              fullWidth
            >
              Equipment
            </Button>
          </Stack>
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
