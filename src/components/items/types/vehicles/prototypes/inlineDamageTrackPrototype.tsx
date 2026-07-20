import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useGearFilter } from "#/components/items/gearHooks.ts"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"
import type { VehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import { isVehicleData } from "#/system/gear/vehicleData.ts"

import { VariantFillBar, VariantNumberedBoxes, VariantWoundTicks } from "./inlineDamageTrackVariants.tsx"

// PROTOTYPE — three ideas for the InlineDamageTrack widget itself, viewed
// next to real vehicle/drone data. Dev-only. Delete this directory once a
// winner is folded into VehicleItemCard.

interface InlineDamageTrackPrototypeProps {
  vehicleCategory: VehicleCategory
}

export const InlineDamageTrackPrototype: FC<InlineDamageTrackPrototypeProps> = ({ vehicleCategory }) => {
  const vehicles = useGearFilter(
    (item): item is VehicleData => isVehicleData(item) && item.vehicleCategory === vehicleCategory,
  )

  if (vehicles.length === 0) return null

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="overline" sx={{ color: "text.secondary" }}>
        Prototype — inline damage track
      </Typography>

      <Prototype>
        <Prototype.Item title="Numbered boxes">
          <DamageCardList vehicles={vehicles} Variant={VariantNumberedBoxes} />
        </Prototype.Item>
        <Prototype.Item title="Wound ticks">
          <DamageCardList vehicles={vehicles} Variant={VariantWoundTicks} />
        </Prototype.Item>
        <Prototype.Item title="Fill bar">
          <DamageCardList vehicles={vehicles} Variant={VariantFillBar} />
        </Prototype.Item>
      </Prototype>
    </Stack>
  )
}

interface VariantComponent {
  (props: { label: string, max: number, current: number, onChange: (value: number) => void }): ReturnType<FC>
}

function DamageCardList({ vehicles, Variant }: { vehicles: VehicleData[], Variant: VariantComponent }) {
  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      {vehicles.map((vehicle) => (
        <DamageCard key={vehicle.id} vehicle={vehicle} Variant={Variant} />
      ))}
    </Stack>
  )
}

function DamageCard({ vehicle, Variant }: { vehicle: VehicleData, Variant: VariantComponent }) {
  const [current, setCurrent] = useState(vehicle.damage?.physical.current ?? 0)
  const max = vehicle.damage?.physical.max || vehicle.body

  return (
    <Box sx={{ border: "1px solid", borderColor: "primary.dark", padding: 1 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{vehicle.name}</Typography>
        <Variant label="Damage" max={max} current={current} onChange={setCurrent} />
      </Stack>
    </Box>
  )
}
