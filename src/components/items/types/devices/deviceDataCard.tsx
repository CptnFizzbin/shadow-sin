import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"

interface DeviceDataCardProps {
  device: DeviceData
  onOpen?: () => void
  onEdit?: () => void
}

export const DeviceDataCard: FC<DeviceDataCardProps> = ({ device, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const programs = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(device.id))

  const deviceTypeLabel =
    device.deviceType === "commlink"
      ? (device.deviceModel ?? "Commlink")
      : (device.customDeviceType ?? "Device")

  const removeDevice = () => dispatch(Actions.gear.removeItem({ id: device.id, removeChildren: true }))

  return (
    <ItemDataCardRoot item={device} subType={deviceTypeLabel} onOpen={onOpen} onEdit={onEdit} onRemove={removeDevice}>
      {device.deviceRating !== undefined && (
        <DataCard.Stat label="Rating" value={device.deviceRating} type="rating" />
      )}
      {device.response !== undefined && <DataCard.Stat label="Res" value={device.response} />}
      {device.signal !== undefined && <DataCard.Stat label="Sig" value={device.signal} />}
      {device.system !== undefined && <DataCard.Stat label="Sys" value={device.system} />}
      {device.firewall !== undefined && <DataCard.Stat label="FW" value={device.firewall} />}

      {Object.values(programs).map((program) => (
        <DataCard.Subitem
          key={program.id}
          name={program.name}
          stats={program.rating !== undefined ? [{ label: "Rating", value: String(program.rating) }] : []}
        />
      ))}
    </ItemDataCardRoot>
  )
}
