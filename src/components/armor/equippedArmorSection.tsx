import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/gear/useGearStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

interface ArmorStatChipProps {
  label: string
}

const ArmorStatChip: FC<ArmorStatChipProps> = ({ label }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.7rem" }}
  />
)

interface EquippedArmorCardProps {
  armor: ArmorData
}

const EquippedArmorCard: FC<EquippedArmorCardProps> = ({ armor }) => (
  <Paper component={Stack} sx={{ padding: 1, gap: 1 }}>
    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
      <Typography>{armor.name}</Typography>

      <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
        <ArmorStatChip label={`B: ${armor.ballistic}`} />
        <ArmorStatChip label={`I: ${armor.impact}`} />
      </Stack>
    </Stack>
  </Paper>
)

export const EquippedArmorSection: FC = () => {
  const allArmor = useGearByType<ArmorData>(ItemType.armor)
  const equippedArmor = allArmor.filter((armor) => armor.equipped)

  if (equippedArmor.length === 0) {
    return (
      <Stack sx={{ gap: 0.5 }}>
        <Label label="Armor" />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          No armor equipped. Equip armor from the Gear page.
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label="Armor" />
      {equippedArmor.map((armor) => (
        <EquippedArmorCard key={armor.id} armor={armor} />
      ))}
    </Stack>
  )
}
