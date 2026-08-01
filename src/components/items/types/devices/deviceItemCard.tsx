import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"

interface DeviceItemCardProps {
  device: DeviceData
  onOpen?: () => void
  onEdit?: () => void
}

export const DeviceItemCard: FC<DeviceItemCardProps> = ({ device, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const programs = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(device.id))

  const deviceTypeLabel =
    device.deviceType === "commlink"
      ? (device.deviceModel ?? "Commlink")
      : (device.customDeviceType ?? "Device")

  const removeDevice = () => dispatch(Actions.gear.removeItem({ id: device.id, removeChildren: true }))

  return (
    <BasicItemCard item={device} type={deviceTypeLabel} onOpen={onOpen} onEdit={onEdit} onRemove={removeDevice}>
      {device.deviceRating !== undefined && (
        <ItemCardSlot.Stat label="Rating" value={device.deviceRating} type="rating" />
      )}
      {device.response !== undefined && <ItemCardSlot.Stat label="Res" value={device.response} />}
      {device.signal !== undefined && <ItemCardSlot.Stat label="Sig" value={device.signal} />}
      {device.system !== undefined && <ItemCardSlot.Stat label="Sys" value={device.system} />}
      {device.firewall !== undefined && <ItemCardSlot.Stat label="FW" value={device.firewall} />}

      {Object.values(programs).map((program) => (
        <ItemCardSlot.Subitem
          key={program.id}
          name={program.name}
          stats={program.rating !== undefined ? [{ label: "Rating", value: String(program.rating) }] : []}
        />
      ))}

      {device.cost !== undefined && (
        <ItemCardSlot.Footer>
          <Nuyen amount={device.cost} />
        </ItemCardSlot.Footer>
      )}
    </BasicItemCard>
  )
}
