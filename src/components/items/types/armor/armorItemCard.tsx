import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"

interface ArmorItemCardProps {
  armor: ArmorData
  onOpen?: () => void
}

export const ArmorItemCard: FC<ArmorItemCardProps> = ({ armor, onOpen }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(armor.id))

  const toggleEquipped = () => dispatch(Actions.gear.setItem({ ...armor, equipped: !armor.equipped }))
  const removeArmor = () => dispatch(Actions.gear.removeItem({ id: armor.id, removeChildren: true }))

  return (
    <BasicItemCard item={armor} onOpen={onOpen} onRemove={removeArmor}>
      <ItemCardSlot.Stat label="B" value={armor.ballistic} type="damage" />
      <ItemCardSlot.Stat label="I" value={armor.impact} type="damage" />

      {Object.values(mods).map((mod) => (
        <ItemCardSlot.Subitem key={mod.id} name={mod.name} />
      ))}

      {armor.equipped
        ? (
            <ItemCardSlot.QuickAction
              label="Unequip"
              icon={<RiCloseCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )
        : (
            <ItemCardSlot.QuickAction
              label="Equip"
              icon={<RiCheckboxCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )}
    </BasicItemCard>
  )
}
