import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useGearFilter, useGearStore } from "#/components/items/useGearStore.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"
import { VehicleItemCard } from "./vehicleItemCard.tsx"

interface VehiclesListProps {
  vehicleCategory: VehicleCategory
}

export const VehiclesList: FC<VehiclesListProps> = ({ vehicleCategory }) => {
  const gearApi = useGearStore()
  const vehicleFormDialog = useVehicleFormDialog()
  const attachmentFormDialog = useItemFormDialog()

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
    if (saved) gearApi.save(saved)
  }

  const handleAddAttachment = async (parentId: UUID) => {
    const saved = await attachmentFormDialog.open({ label: "Vehicle Attachment" })
    if (saved) gearApi.save({ ...saved, parentId })
  }

  const handleEditAttachment = async (attachment: ItemData) => {
    const saved = await attachmentFormDialog.open({ item: attachment, label: "Vehicle Attachment" })
    if (saved) gearApi.save(saved)
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
            onRemove={() => gearApi.remove(vehicle)}
            onAddAttachment={() => handleAddAttachment(vehicle.id as UUID)}
            onEditAttachment={(attachment) => handleEditAttachment(attachment)}
            onRemoveAttachment={(attachment) => gearApi.remove(attachment)}
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
    </Stack>
  )
}
