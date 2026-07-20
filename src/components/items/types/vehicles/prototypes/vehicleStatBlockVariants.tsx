import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"

// PROTOTYPE — throwaway variants for how to lay out a vehicle/drone's stat
// block (Handling/Accel/Speed, Pilot/Body/Armor/Sensor). Damage is rendered
// separately by the card shell via InlineDamageTrack.
// See vehicleStatBlockPrototype.tsx for the switcher wiring.

interface VariantProps {
  vehicle: VehicleData
}

function StatTile({ label, value }: { label: string, value: string }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        padding: "2px 4px",
      }}
    >
      <Typography sx={{ fontSize: "0.6rem", color: "text.secondary", lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Box>
  )
}

/** Variant A — two rows of labelled stat tiles: movement stats, then systems stats. */
export const VariantTileGrid: FC<VariantProps> = ({ vehicle }) => (
  <Stack sx={{ gap: 0.5 }}>
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.5 }}>
      <StatTile label="HDL" value={String(vehicle.handling)} />
      <StatTile label="ACC" value={vehicle.accel} />
      <StatTile label="SPD" value={String(vehicle.speed)} />
    </Box>
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.5 }}>
      <StatTile label="PLT" value={String(vehicle.pilot)} />
      <StatTile label="BOD" value={String(vehicle.body)} />
      <StatTile label="ARM" value={String(vehicle.armor)} />
      <StatTile label="SNS" value={String(vehicle.sensor)} />
    </Box>
  </Stack>
)

/** Variant B — a single dense line of abbreviated stat pairs, for scanning many vehicles at once. */
export const VariantCompactRow: FC<VariantProps> = ({ vehicle }) => (
  <Typography sx={{ fontSize: "0.75rem", fontFamily: "monospace" }}>
    HDL {vehicle.handling} · ACC {vehicle.accel} · SPD {vehicle.speed} · PLT {vehicle.pilot} · BOD{" "}
    {vehicle.body} · ARM {vehicle.armor} · SNS {vehicle.sensor}
  </Typography>
)

/** Variant C — two labelled sub-groups (Movement, Systems), spec-sheet style. */
export const VariantGroupedSections: FC<VariantProps> = ({ vehicle }) => (
  <Stack sx={{ gap: 1, width: "100%" }}>
    <Stack sx={{ gap: 0.25 }}>
      <Label label="Movement" textAlign="left" sx={{ fontSize: "0.7rem" }} />
      <Stack direction="row" sx={{ gap: 2 }}>
        <Typography sx={{ fontSize: "0.8rem" }}>Handling {vehicle.handling}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Accel {vehicle.accel}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Speed {vehicle.speed}</Typography>
      </Stack>
    </Stack>

    <Stack sx={{ gap: 0.25 }}>
      <Label label="Systems" textAlign="left" sx={{ fontSize: "0.7rem" }} />
      <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: "0.8rem" }}>Pilot {vehicle.pilot}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Body {vehicle.body}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Armor {vehicle.armor}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>Sensor {vehicle.sensor}</Typography>
      </Stack>
    </Stack>
  </Stack>
)
