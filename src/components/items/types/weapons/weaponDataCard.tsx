import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData, isMeleeWeaponData } from "#/system/gear/weaponData.ts"

import { WeaponCard } from "./weaponCard.tsx"

interface WeaponDataCardProps {
  weapon: WeaponData
  onOpen?: () => void
  onEdit?: () => void
}

export const WeaponDataCard: FC<WeaponDataCardProps> = ({
  weapon,
  onOpen,
  onEdit,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(weapon.id))
  const hasAccessories = Object.keys(accessories).length > 0

  const toggleEquipped = () => dispatch(Actions.gear.setItem({ ...weapon, equipped: !weapon.equipped }))
  const removeWeapon = () => dispatch(Actions.gear.removeItem({ id: weapon.id, removeChildren: true }))

  return (
    <WeaponCard item={weapon} onOpen={onOpen} onEdit={onEdit} onRemove={removeWeapon}>
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
          {Object.values(accessories).map((accessory) => (
            <WeaponCard.Subitem key={accessory.id} name={accessory.name} />
          ))}
        </WeaponCard.Layout.BodyRow>
      )}

      {weapon.equipped
        ? (
            <WeaponCard.Action
              label="Unequip"
              icon={<RiCloseCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )
        : (
            <WeaponCard.Action
              label="Equip"
              icon={<RiCheckboxCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )}
    </WeaponCard>
  )
}
