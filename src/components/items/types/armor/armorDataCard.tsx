import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { ItemCard } from "#/components/cards/itemCard/itemCard.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"

interface ArmorDataCardProps {
  armor: ArmorData
  onOpen?: () => void
  onEdit?: () => void
}

export const ArmorDataCard: FC<ArmorDataCardProps> = ({ armor, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: armor.id })
  const hasMods = Object.keys(mods).length > 0

  const toggleEquipped = () => dispatch(Actions.item.setItem({ ...armor, equipped: !armor.equipped }))
  const removeArmor = () => dispatch(Actions.item.removeItem({ id: armor.id, removeChildren: true }))

  return (
    <ItemCard item={armor} onOpen={onOpen} onEdit={onEdit} onRemove={removeArmor}>
      <ItemCard.Stat label="B" value={armor.ballistic} type="damage" />
      <ItemCard.Stat label="I" value={armor.impact} type="damage" />

      {hasMods && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          {Object.values(mods).map((mod) => (
            <ItemCard.Subitem key={mod.id} name={mod.name} />
          ))}
        </ItemCard.Layout.BodyRow>
      )}

      {armor.equipped
        ? (
            <ItemCard.Action
              label="Unequip"
              icon={<RiCloseCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )
        : (
            <ItemCard.Action
              label="Equip"
              icon={<RiCheckboxCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )}
    </ItemCard>
  )
}
