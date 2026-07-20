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

const versions = [
  { key: "numbered-boxes", name: "Numbered boxes" },
  { key: "wound-ticks", name: "Wound ticks" },
  { key: "fill-bar", name: "Fill bar" },
]

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

      <Prototype versions={versions}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          {vehicles.map((vehicle) => (
            <DamageCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </Stack>
      </Prototype>
    </Stack>
  )
}

function DamageCard({ vehicle }: { vehicle: VehicleData }) {
  const [current, setCurrent] = useState(vehicle.damage?.physical.current ?? 0)
  const max = vehicle.damage?.physical.max || vehicle.body

  return (
    <Box sx={{ border: "1px solid", borderColor: "primary.dark", padding: 1 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{vehicle.name}</Typography>

        <Prototype.Item version="numbered-boxes">
          <VariantNumberedBoxes label="Damage" max={max} current={current} onChange={setCurrent} />
        </Prototype.Item>
        <Prototype.Item version="wound-ticks">
          <VariantWoundTicks label="Damage" max={max} current={current} onChange={setCurrent} />
        </Prototype.Item>
        <Prototype.Item version="fill-bar">
          <VariantFillBar label="Damage" max={max} current={current} onChange={setCurrent} />
        </Prototype.Item>
      </Stack>
    </Box>
  )
}
