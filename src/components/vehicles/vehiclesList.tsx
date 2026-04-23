import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ItemFormDialog } from "#/components/gear/dialogs/itemFormDialog.tsx"
import { ItemCard } from "#/components/gear/itemCard.tsx"
import { VehicleFormDialog } from "#/components/vehicles/dialogs/vehicleFormDialog.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { useGearFilter, useGearStore } from "../gear/useGearStore.ts"

type VehicleDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", vehicle: VehicleData, open: boolean }

type AttachmentDialogState =
  | null
  | { mode: "create", parentId: UUID, open: boolean }
  | { mode: "edit", item: ItemData, open: boolean }

interface VehiclesListProps {
  vehicleCategory: VehicleCategory
}

export const VehiclesList: FC<VehiclesListProps> = ({ vehicleCategory }) => {
  const gearApi = useGearStore()
  const [vehicleDialog, setVehicleDialog] = useState<VehicleDialogState>(null)
  const [attachmentDialog, setAttachmentDialog] = useState<AttachmentDialogState>(null)

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

  const closeVehicleDialog = () =>
    setVehicleDialog((prev) => prev && { ...prev, open: false })

  const closeAttachmentDialog = () =>
    setAttachmentDialog((prev) => prev && { ...prev, open: false })

  const handleSaveVehicle = (vehicle: VehicleData) => {
    gearApi.save(vehicle)
    closeVehicleDialog()
  }

  const handleAddAttachment = (item: ItemData) => {
    if (attachmentDialog?.mode !== "create") return
    gearApi.save({ ...item, parentId: attachmentDialog.parentId })
    closeAttachmentDialog()
  }

  const handleUpdateAttachment = (item: ItemData) => {
    gearApi.save(item)
    closeAttachmentDialog()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {vehicles.map((vehicle) => {
        const attachments = getAttachments(vehicle.id)

        return (
          <Box key={vehicle.id}>
            <ItemCard
              item={vehicle}
              onEdit={() => setVehicleDialog({ mode: "edit", vehicle, open: true })}
              onRemove={() => gearApi.remove(vehicle)}
            />

            <Stack
              sx={{
                gap: 1,
                paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: attachments.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: attachments.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {attachments.map((attachment) => (
                <ItemCard
                  key={attachment.id}
                  item={attachment}
                  onEdit={() =>
                    setAttachmentDialog({ mode: "edit", item: attachment, open: true })}
                  onRemove={() => gearApi.remove(attachment)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() =>
                  setAttachmentDialog({
                    mode: "create",
                    parentId: vehicle.id,
                    open: true,
                  })}
                color="secondary"
                fullWidth
              >
                Add Attachment
              </Button>
            </Stack>
          </Box>
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setVehicleDialog({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add {categoryLabel}
      </Button>

      {vehicleDialog?.mode === "create" && (
        <VehicleFormDialog
          open={vehicleDialog.open}
          vehicleCategory={vehicleCategory}
          onSave={handleSaveVehicle}
          onClose={closeVehicleDialog}
          onClosed={() => setVehicleDialog(null)}
        />
      )}

      {vehicleDialog?.mode === "edit" && (
        <VehicleFormDialog
          open={vehicleDialog.open}
          vehicle={vehicleDialog.vehicle}
          onSave={handleSaveVehicle}
          onClose={closeVehicleDialog}
          onClosed={() => setVehicleDialog(null)}
        />
      )}

      {attachmentDialog?.mode === "create" && (
        <ItemFormDialog
          open={attachmentDialog.open}
          label="Vehicle Attachment"
          onSave={handleAddAttachment}
          onClose={closeAttachmentDialog}
          onClosed={() => setAttachmentDialog(null)}
        />
      )}

      {attachmentDialog?.mode === "edit" && (
        <ItemFormDialog
          open={attachmentDialog.open}
          item={attachmentDialog.item}
          label="Vehicle Attachment"
          onSave={handleUpdateAttachment}
          onClose={closeAttachmentDialog}
          onClosed={() => setAttachmentDialog(null)}
        />
      )}
    </Stack>
  )
}
