import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useDeviceFormDialog } from "./dialogs/deviceFormDialog.tsx"

export interface DeviceItemDetailsProps {
  device: DeviceData
  onRemoved?: () => void
  onOpenAttachment?: (item: ItemData) => void
}

export const DeviceItemDetails: FC<DeviceItemDetailsProps> = ({
  device,
  onRemoved,
  onOpenAttachment,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const programs = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(device.id))
  const deviceFormDialog = useDeviceFormDialog()

  const deviceTypeLabel =
    device.deviceType === "commlink"
      ? (device.deviceModel ?? "Commlink")
      : (device.customDeviceType ?? "Device")

  const removeDevice = () => {
    dispatch(Actions.gear.removeItem({ id: device.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await deviceFormDialog.open({ device })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <BasicItemDetails item={device} type={deviceTypeLabel} onEdit={handleEdit} onRemove={removeDevice}>
        {device.deviceRating !== undefined && (
          <ItemDetailsSlot.Stat label="Rating" value={device.deviceRating} type="rating" />
        )}
        {device.response !== undefined && <ItemDetailsSlot.Stat label="Response" value={device.response} />}
        {device.signal !== undefined && <ItemDetailsSlot.Stat label="Signal" value={device.signal} />}
        {device.system !== undefined && <ItemDetailsSlot.Stat label="System" value={device.system} />}
        {device.firewall !== undefined && <ItemDetailsSlot.Stat label="Firewall" value={device.firewall} />}

        {Object.values(programs).map((program) => (
          <ItemDetailsSlot.Subitem
            key={program.id}
            item={program}
            onOpen={onOpenAttachment ? () => onOpenAttachment(program) : undefined}
          />
        ))}
      </BasicItemDetails>

      {deviceFormDialog.dialog}
    </>
  )
}
