import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card-redesign/itemCard.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { ItemType } from "#/system/itemType.ts"

export const WeaponsSectionContent: FC = () => {
  const weapons = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.weapon))

  return (
    <Stack sx={{ gap: 1 }}>
      {Object.values(weapons).map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </Stack>
  )
}
