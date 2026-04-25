import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { useGearByType } from "#/components/items/useGearStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

interface EquippedArmorCardProps {
  armor: ArmorData
}

const EquippedArmorCard: FC<EquippedArmorCardProps> = ({ armor }) => (
  <ItemCard>
    <ItemCard.Title>{armor.name}</ItemCard.Title>
    <ItemCard.Meta type="stat">
      <ItemStatChip label={`B: ${armor.ballistic}`} />
      <ItemStatChip label={`I: ${armor.impact}`} />
    </ItemCard.Meta>
  </ItemCard>
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
