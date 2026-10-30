import type { FC } from "react"

import { useAddItemDialogContext } from "#/components/entities/items/addItemDialogContext.ts"
import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"

import { DeviceProgramsSection } from "./deviceProgramsSection.tsx"
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
  const attachments = useRunnerSelector(ItemSelectors.selectChildListOf, { itemId: device.id })
  const deviceFormDialog = useDeviceFormDialog()
  const addItemDialog = useAddItemDialogContext()

  const programs = attachments.filter((item): item is ProgramData => item.itemType === ItemType.program)
  const subitems = attachments.filter((item) => item.itemType !== ItemType.program)

  const deviceTypeLabel =
    device.deviceType === "commlink"
      ? (device.deviceModel ?? "Commlink")
      : (device.customDeviceType ?? "Device")

  const removeDevice = () => {
    dispatch(Actions.item.removeItem({ id: device.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await deviceFormDialog.open({ device })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddSubitem = () => addItemDialog.open({ parentId: device.id })

  return (
    <>
      <ItemDetailsRoot
        item={device}
        type={deviceTypeLabel}
        onEdit={handleEdit}
        onRemove={removeDevice}
        onAddSubitem={handleAddSubitem}
      >
        {device.deviceRating !== undefined && (
          <ItemDetailsSlot.Stat label="Rating" value={device.deviceRating} type="rating" />
        )}
        {device.response !== undefined && <ItemDetailsSlot.Stat label="Response" value={device.response} />}
        {device.signal !== undefined && <ItemDetailsSlot.Stat label="Signal" value={device.signal} />}
        {device.system !== undefined && <ItemDetailsSlot.Stat label="System" value={device.system} />}
        {device.firewall !== undefined && <ItemDetailsSlot.Stat label="Firewall" value={device.firewall} />}

        <ItemDetailsSlot.Section>
          <DeviceProgramsSection device={device} programs={programs} onOpenProgram={onOpenAttachment} />
        </ItemDetailsSlot.Section>

        {subitems.map((item) => (
          <ItemDetailsSlot.Subitem
            key={item.id}
            item={item}
            onOpen={onOpenAttachment ? () => onOpenAttachment(item) : undefined}
          />
        ))}
      </ItemDetailsRoot>

      {deviceFormDialog.outlet}
    </>
  )
}
