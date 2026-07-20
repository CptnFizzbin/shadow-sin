import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useGearFilter } from "#/components/items/gearHooks.ts"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"
import type { VehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import { isVehicleData } from "#/system/gear/vehicleData.ts"

import { VariantCompactRow, VariantGroupedSections, VariantTileGrid } from "./vehicleStatBlockVariants.tsx"

// PROTOTYPE — three layouts for the Handling/Accel/Speed, Pilot/Body/Armor/Sensor,
// and damage-track stat block on a vehicle/drone card. Dev-only, real data,
// switchable via the floating bar. Delete this directory once a winner is folded
// into VehicleItemCard.

interface VehicleStatBlockPrototypeProps {
  vehicleCategory: VehicleCategory
}

export const VehicleStatBlockPrototype: FC<VehicleStatBlockPrototypeProps> = ({ vehicleCategory }) => {
  const vehicles = useGearFilter(
    (item): item is VehicleData => isVehicleData(item) && item.vehicleCategory === vehicleCategory,
  )

  if (vehicles.length === 0) return null

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="overline" sx={{ color: "text.secondary" }}>
        Prototype — stat block layout
      </Typography>

      <Prototype>
        <Prototype.Item title="Tile grid">
          <VehicleStatCardList vehicles={vehicles} Variant={VariantTileGrid} />
        </Prototype.Item>
        <Prototype.Item title="Compact row">
          <VehicleStatCardList vehicles={vehicles} Variant={VariantCompactRow} />
        </Prototype.Item>
        <Prototype.Item title="Grouped sections">
          <VehicleStatCardList vehicles={vehicles} Variant={VariantGroupedSections} />
        </Prototype.Item>
      </Prototype>
    </Stack>
  )
}

function VehicleStatCardList({
  vehicles,
  Variant,
}: {
  vehicles: VehicleData[]
  Variant: FC<{ vehicle: VehicleData }>
}) {
  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      {vehicles.map((vehicle) => (
        <VehicleStatCard key={vehicle.id} vehicle={vehicle} Variant={Variant} />
      ))}
    </Stack>
  )
}

function VehicleStatCard({ vehicle, Variant }: { vehicle: VehicleData, Variant: FC<{ vehicle: VehicleData }> }) {
  const [current, setCurrent] = useState(vehicle.damage?.physical.current ?? 0)
  const max = vehicle.damage?.physical.max || vehicle.body

  return (
    <Box sx={{ border: "1px solid", borderColor: "primary.dark", padding: 1 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{vehicle.name}</Typography>

        <Variant vehicle={vehicle} />

        <InlineDamageTrack label="Damage" max={max} current={current} onChange={setCurrent} />
      </Stack>
    </Box>
  )
}
