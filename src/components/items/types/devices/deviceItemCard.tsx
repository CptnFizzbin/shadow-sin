import Typography from "@mui/material/Typography"
import { RiFileShieldLine } from "@remixicon/react"
import type { FC } from "react"

import { GearItemCard } from "#/components/items/card/gearItemCard.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { useQuickBuyLicenseAction } from "#/components/items/types/licenses/useQuickBuyLicenseAction.ts"
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
  const licenseQuickBuy = useQuickBuyLicenseAction(device)

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
    <>
      <GearItemCard
        availability={availability}
        source={source}
        onEdit={onEdit}
        onRemove={onRemove}
      >
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

        {onAddProgram && (
          <ItemCard.AddChildButton onClick={onAddProgram}>
            Add Program
          </ItemCard.AddChildButton>
        )}

        {programs.length > 0 && (
          <ItemCard.Children>
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

        {licenseQuickBuy.eligible && (
          <ItemCard.Action type="icon" aria-label="Buy License" onClick={licenseQuickBuy.open}>
            <RiFileShieldLine size={16} />
          </ItemCard.Action>
        )}
      </GearItemCard>

      {licenseQuickBuy.dialog}
    </>
  )
}
