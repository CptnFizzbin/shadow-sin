import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { isEquipped } from "#/system/items/itemUtils.ts"

interface ArmorDataCardProps {
  armor: ArmorData
  onOpen?: () => void
  onEdit?: () => void
}

export const ArmorDataCard: FC<ArmorDataCardProps> = ({ armor, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(armor.id))

  const toggleEquipped = () => dispatch(Actions.item.setEquipped({ id: armor.id, equipped: !isEquipped(armor) }))
  const removeArmor = () => dispatch(Actions.gear.removeItem({ id: armor.id, removeChildren: true }))

  return (
    <ItemDataCardRoot item={armor} onOpen={onOpen} onEdit={onEdit} onRemove={removeArmor}>
      <DataCard.Stat label="B" value={armor.ballistic} type="damage" />
      <DataCard.Stat label="I" value={armor.impact} type="damage" />

      {Object.values(mods).map((mod) => (
        <DataCard.Subitem key={mod.id} name={mod.name} />
      ))}

      {isEquipped(armor)
        ? (
            <DataCard.QuickAction
              label="Unequip"
              icon={<RiCloseCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )
        : (
            <DataCard.QuickAction
              label="Equip"
              icon={<RiCheckboxCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )}
    </ItemDataCardRoot>
  )
}
