import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ItemCardGrid } from "#/components/entities/items/card/itemCardGrid.tsx"
import { useGearListView } from "#/components/entities/items/viewer/gearListFilter.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { useEncumbrance } from "#/hooks/system/encumbrance/useEncumbrance.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

import { ArmorDataCard } from "./armorDataCard.tsx"

/** The armor the Runner has on hand, Equipped first, with the Encumbrance it adds up to. */
export const AvailableArmorSection: FC = () => {
  const allArmor = useGearByType<ArmorData>(ItemType.armor)
  const openItemDetails = useOpenItemDetails()
  const gearListView = useGearListView()
  const armorOnHand = gearListView(allArmor.filter((armor) => !armor.items.parentId))
  const { totalBallistic, totalImpact, threshold, penalty, isEncumbered } = useEncumbrance()

  if (armorOnHand.length === 0) {
    return (
      <Stack sx={{ gap: 0.5 }}>
        <Label label="Armor" />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          No armor on hand. Add or unstash armor from the Gear page.
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
      <ItemCardGrid>
        {armorOnHand.map((armor) => (
          <ArmorDataCard
            key={armor.id}
            armor={armor}
            onOpen={openItemDetails ? () => openItemDetails(armor.id) : undefined}
          />
        ))}
      </ItemCardGrid>
    </Stack>
  )
}
