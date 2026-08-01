import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card-redesign/itemCard.tsx"
import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useVehicleFormDialog } from "#/components/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { VehicleItemCard } from "#/components/items/types/vehicles/vehicleItemCard.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

export const VehiclesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const allGear = useRunnerStoreSelector(Selectors.gear.selectAllGear)
  const vehicleFormDialog = useVehicleFormDialog()
  const attachmentFormDialog = useItemFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const vehicles = Object.values(allGear).filter(isVehicleData)
  const getAttachments = (vehicleId: string) =>
    Object.values(allGear).filter((item) => !isVehicleData(item) && item.parentId === vehicleId)

  const handleEditVehicle = async (vehicle?: VehicleData) => {
    const saved = await vehicleFormDialog.open({ vehicle })
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
            <VehicleItemCard
              vehicle={vehicle}
              onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: vehicle.id } })}
              onEdit={() => handleEditVehicle(vehicle)}
            />

            {attachments.length > 0 && (
              <Stack sx={{ gap: 1, pl: 2 }}>
                {attachments.map((attachment) => (
                  <ItemCard
                    key={attachment.id}
                    item={attachment}
                    onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: attachment.id } })}
                    onEdit={() => handleEditAttachment(attachment)}
                    onRemove={() => dispatch(Actions.gear.removeItem({ id: attachment.id }))}
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
        Add Vehicle
      </Button>

      {vehicleFormDialog.dialog}
      {attachmentFormDialog.dialog}
    </Stack>
  )
}
