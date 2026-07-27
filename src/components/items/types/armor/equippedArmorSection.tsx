import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/items/gearHooks.ts"
import { useEncumbrance } from "#/components/system/encumbrance/useEncumbrance.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

import { EquippedArmorCard } from "./equippedArmorCard.tsx"

export const EquippedArmorSection: FC = () => {
  const allArmor = useGearByType<ArmorData>(ItemType.armor)
  const equippedArmor = allArmor.filter((armor) => armor.equipped)
  const dispatch = useRunnerStoreDispatch()
  const { totalBallistic, totalImpact, threshold, penalty, isEncumbered } = useEncumbrance()

  const handleDamageChange = (armor: ArmorData, damage: NonNullable<ArmorData["damage"]>) => {
    const clamped: NonNullable<ArmorData["damage"]> = {
      ballistic: Math.min(Math.max(0, damage.ballistic), armor.ballistic),
      impact: Math.min(Math.max(0, damage.impact), armor.impact),
    }
    const updated: ArmorData = { ...armor, damage: clamped }
    dispatch(Actions.gear.setItem(updated))
  }

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
      <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
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
        <EquippedArmorCard
          key={armor.id}
          armor={armor}
          onDamageChange={(damage) => handleDamageChange(armor, damage)}
        />
      ))}
    </Stack>
  )
}
