import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"

interface ArmorDataCardProps {
  armor: ArmorData
  onOpen?: () => void
  onEdit?: () => void
}

export const ArmorDataCard: FC<ArmorDataCardProps> = ({ armor, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(armor.id))
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
