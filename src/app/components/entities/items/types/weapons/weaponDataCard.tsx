import type { FC } from "react"

import { ItemAttachmentTree } from "#/app/components/entities/items/card/itemAttachmentTree.tsx"
import type { EntityCardLeftAction } from "#/app/components/ui/cards/entityCard/entityCard.tsx"
import type { WeaponData } from "#/data/items/weaponData.ts"
import { isFirearmData, isMeleeWeaponData } from "#/data/items/weaponData.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { WeaponCard } from "./weaponCard.tsx"

interface WeaponDataCardProps {
  weapon: WeaponData
  onOpen?: () => void
  onEdit?: () => void
  leftAction?: EntityCardLeftAction
}

export const WeaponDataCard: FC<WeaponDataCardProps> = ({
  weapon,
  onOpen,
  onEdit,
  leftAction,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const accessories = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: weapon.id })
  const hasAccessories = Object.keys(accessories).length > 0

  const removeWeapon = () => dispatch(Actions.item.removeItem({ id: weapon.id, removeChildren: true }))

  return (
    <WeaponCard item={weapon} onOpen={onOpen} onEdit={onEdit} onRemove={removeWeapon} leftAction={leftAction}>
      <WeaponCard.Layout.BodyRow sx={{ flexWrap: "wrap" }}>
        <WeaponCard.Stat label="DV" value={weapon.dmg} type="damage" />
        {weapon.ap ? <WeaponCard.Stat label="AP" value={weapon.ap} type="damage" /> : null}
        {weapon.dmgType && <WeaponCard.Stat label="Dmg Type" value={weapon.dmgType} />}
        <WeaponCard.Stat value={weapon.skill} type="rating" />
        {weapon.attribute && <WeaponCard.Stat label="Attribute" value={weapon.attribute} />}

        {isFirearmData(weapon) && (
          <>
            <WeaponCard.Stat value={weapon.firearmType} type="rating" />
            {weapon.firemodes && <WeaponCard.Stat value={weapon.firemodes.join("/")} type="rating" />}
            <WeaponCard.Stat label="RC" value={weapon.recoil} />
            {weapon.attachmentPoints && (
              <WeaponCard.Stat label="Mounts" value={weapon.attachmentPoints.join("/")} />
            )}
            <WeaponCard.Ammo value={weapon.ammo} />
          </>
        )}

        {isMeleeWeaponData(weapon) && (
          <>
            <WeaponCard.Stat label="Reach" value={weapon.reach} />
            {weapon.meleeType && <WeaponCard.Stat label="Type" value={weapon.meleeType} />}
          </>
        )}
      </WeaponCard.Layout.BodyRow>

      {hasAccessories && (
        <WeaponCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          <ItemAttachmentTree itemId={weapon.id} />
        </WeaponCard.Layout.BodyRow>
      )}
    </WeaponCard>
  )
}
