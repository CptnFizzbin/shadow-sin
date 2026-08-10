import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
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
  const hasPrograms = Object.keys(programs).length > 0

  const deviceTypeLabel =
    device.deviceType === "commlink"
      ? (device.deviceModel ?? "Commlink")
      : (device.customDeviceType ?? "Device")

  const removeDevice = () => dispatch(Actions.item.removeItem({ id: device.id, removeChildren: true }))

  return (
    <ItemCard item={device} onOpen={onOpen} onEdit={onEdit} onRemove={removeDevice}>
      <ItemCard.SubType label={deviceTypeLabel} />

      <ItemCard.Stat label="Rating" value={device.deviceRating} type="rating" />
      <ItemCard.Stat label="Res" value={device.response} />
      <ItemCard.Stat label="Sig" value={device.signal} />
      <ItemCard.Stat label="Sys" value={device.system} />
      <ItemCard.Stat label="FW" value={device.firewall} />

      {hasPrograms && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          {Object.values(programs).map((program) => (
            <ItemCard.Subitem
              key={program.id}
              name={program.name}
              stats={program.rating !== undefined ? [{ label: "Rating", value: program.rating }] : []}
            />
          ))}
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
