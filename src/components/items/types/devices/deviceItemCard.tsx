import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"

import { ProgramItemCard } from "./programItemCard.tsx"

interface DeviceItemCardProps {
  device: DeviceData
  programs?: ProgramData[]
  onEdit: () => void
  onRemove: () => void
  onAddProgram?: () => void
  onEditProgram?: (program: ProgramData) => void
  onRemoveProgram?: (program: ProgramData) => void
}

export const DeviceItemCard: FC<DeviceItemCardProps> = ({
  device,
  programs = [],
  onEdit,
  onRemove,
  onAddProgram,
  onEditProgram,
  onRemoveProgram,
}) => {
  const { availability, source } = device

  const deviceTypeLabel =
    device.deviceType === "commlink"
      ? (device.deviceModel ?? "Commlink")
      : (device.customDeviceType ?? "Device")

  const hasStats =
    device.response !== undefined
    || device.signal !== undefined
    || device.system !== undefined
    || device.firewall !== undefined

  return (
    <ItemCard onClick={onEdit}>
      <ItemCard.Title>{device.name}</ItemCard.Title>

      {device.cost !== undefined && (
        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={device.cost} />
          </Typography>
        </ItemCard.Meta>
      )}

      <ItemCard.Meta type="stat">
        <ItemStatChip label={deviceTypeLabel} />
        {device.deviceRating !== undefined && (
          <ItemStatChip label={`Rating: ${device.deviceRating}`} />
        )}
      </ItemCard.Meta>

      {hasStats && (
        <ItemCard.Meta type="stat">
          {device.response !== undefined && (
            <ItemStatChip label={`Res: ${device.response}`} />
          )}
          {device.signal !== undefined && (
            <ItemStatChip label={`Sig: ${device.signal}`} />
          )}
          {device.system !== undefined && (
            <ItemStatChip label={`Sys: ${device.system}`} />
          )}
          {device.firewall !== undefined && (
            <ItemStatChip label={`FW: ${device.firewall}`} />
          )}
        </ItemCard.Meta>
      )}

      {availability && (
        <ItemCard.Meta type="stat">
          <AvailabilityChip
            availability={availability}
            color={availability.rating > GearMaxAvailability ? "warning" : undefined}
          />
        </ItemCard.Meta>
      )}

      {source && (
        <ItemCard.Meta type="source">
          <ItemStatChip label={`${source.book} p.${source.page}`} />
        </ItemCard.Meta>
      )}

      <ItemCard.Action type="icon" color="error" onClick={onRemove}>
        <RiDeleteBin6Line size={16} />
      </ItemCard.Action>

      {(programs.length > 0 || onAddProgram) && (
        <ItemCard.Children>
          {onAddProgram && (
            <ItemCard.AddChildButton onClick={onAddProgram}>
              Add Program
            </ItemCard.AddChildButton>
          )}
          {programs.map((program) => (
            <ProgramItemCard
              key={program.id}
              program={program}
              variant="borderless"
              onEdit={() => onEditProgram?.(program)}
              onRemove={() => onRemoveProgram?.(program)}
            />
          ))}
        </ItemCard.Children>
      )}
    </ItemCard>
  )
}
