import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { useEncumbrance } from "#/hooks/system/encumbrance/useEncumbrance.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ArmorDataCard } from "./armorDataCard.tsx"

export const EquippedArmorSection: FC = () => {
  const allArmor = useGearByType<ArmorData>(ItemType.armor)
  const equippedArmor = allArmor.filter((armor) => armor.equipped)
  const { totalBallistic, totalImpact, threshold, penalty, isEncumbered } = useEncumbrance()

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
    <Stack>
      <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Label label="Armor" />
        <Chip size="small" label={`B: ${totalBallistic}/${threshold}`} variant="outlined" />
        <Chip size="small" label={`I: ${totalImpact}/${threshold}`} variant="outlined" />
        {isEncumbered && (
          <Chip
            size="small"
            label={`Encumbered: −${penalty} Agility & Reaction`}
            color="warning"
          />
        )}
      </Stack>
      {equippedArmor.map((armor) => (
        <ArmorDataCard key={armor.id} armor={armor} />
      ))}
    </Stack>
  )
}
