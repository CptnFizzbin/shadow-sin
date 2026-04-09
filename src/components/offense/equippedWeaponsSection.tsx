import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType, useGearStore } from "#/components/gear/useGearApi.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import { WeaponType, isFirearmData, isWeaponData } from "#/lib/system/gear/weaponData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

const WeaponStatChip: FC<{ label: string }> = ({ label }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.7rem" }}
  />
)

interface WeaponCardProps {
  weapon: WeaponData
  accessories: ItemData[]
  onToggleEquipped: () => void
}

const WeaponCard: FC<WeaponCardProps> = ({ weapon, accessories, onToggleEquipped }) => {
  const isFirearm = isFirearmData(weapon)

  return (
    <Stack
      gap={0.5}
      sx={{
        "padding": 1,
        "borderRadius": 1,
        "border": "2px solid",
        "borderColor": weapon.equipped ? "success.main" : "divider",
        "backgroundColor": weapon.equipped ? "success.dark" : undefined,
        "opacity": weapon.equipped ? 1 : 0.6,
        "cursor": "pointer",
        "&:hover": { borderColor: weapon.equipped ? "success.light" : "primary.main" },
      }}
      onClick={onToggleEquipped}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography sx={{ flexGrow: 1, fontSize: "0.875rem", fontWeight: "medium" }}>
          {weapon.name}
        </Typography>
        {weapon.equipped && (
          <Chip
            label="Equipped"
            size="small"
            color="success"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}
      </Stack>

      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {weapon.dmg && <WeaponStatChip label={`DV: ${weapon.dmg}`} />}
        {weapon.ap !== undefined && weapon.ap !== 0 && (
          <WeaponStatChip label={`AP: ${weapon.ap}`} />
        )}
        {weapon.skill && <WeaponStatChip label={weapon.skill} />}
        {weapon.weaponType === WeaponType.melee && (
          <WeaponStatChip label="Melee" />
        )}
        {isFirearm && (
          <>
            <WeaponStatChip label={weapon.firearmType} />
            {weapon.firemodes.length > 0 && (
              <WeaponStatChip label={weapon.firemodes.join("/")} />
            )}
            <WeaponStatChip
              label={`Ammo: ${weapon.ammo.remaining}/${weapon.ammo.size}`}
            />
          </>
        )}
        {accessories.length > 0 && (
          <WeaponStatChip label={`${accessories.length} mod${accessories.length > 1 ? "s" : ""}`} />
        )}
      </Stack>
    </Stack>
  )
}

export const EquippedWeaponsSection: FC = () => {
  const gearStore = useGearStore()
  const allWeapons = useGearByType<WeaponData>(GearType.weapon)

  const topLevelWeapons = allWeapons.filter((weapon) => !weapon.parentId)
  const getAccessories = (parentId: string) =>
    allWeapons.filter((weapon) => weapon.parentId === parentId)

  const handleToggleEquipped = (weapon: WeaponData) => {
    gearStore.save({ ...weapon, equipped: !weapon.equipped })
  }

  if (topLevelWeapons.length === 0) {
    return (
      <Stack gap={0.5}>
        <Label label="Weapons" />
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ py: 2 }}
        >
          No weapons in gear. Add weapons in the builder.
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack gap={1}>
      <Label label="Weapons" />
      <Typography variant="caption" color="text.secondary" textAlign="center">
        Tap a weapon to equip / unequip it
      </Typography>
      {topLevelWeapons.filter(isWeaponData).map((weapon) => (
        <WeaponCard
          key={weapon.id}
          weapon={weapon}
          accessories={getAccessories(weapon.id)}
          onToggleEquipped={() => handleToggleEquipped(weapon)}
        />
      ))}
    </Stack>
  )
}
