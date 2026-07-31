import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"

interface VehicleItemCardProps {
  vehicle: VehicleData
  onOpen?: () => void
}

export const VehicleItemCard: FC<VehicleItemCardProps> = ({ vehicle, onOpen }) => {
  const dispatch = useRunnerStoreDispatch()
  const damageMax = vehicle.damage?.physical.max || vehicle.body

  const removeVehicle = () => dispatch(Actions.gear.removeItem({ id: vehicle.id, removeChildren: true }))

  const handleDamageChange = (current: number) => {
    const updated: VehicleData = { ...vehicle, damage: { physical: { current, max: damageMax } } }
    dispatch(Actions.gear.setItem(updated))
  }

  return (
    <BasicItemCard item={vehicle} type={vehicle.vehicleType} onOpen={onOpen} onRemove={removeVehicle}>
      <ItemCardSlot.Stat label="Handling" value={vehicle.handling} type="rating" />
      <ItemCardSlot.Stat label="Accel" value={vehicle.accel} type="rating" />
      <ItemCardSlot.Stat label="Speed" value={vehicle.speed} type="rating" />
      <ItemCardSlot.Stat label="Armor" value={vehicle.armor} type="damage" />
      <ItemCardSlot.Stat label="Body" value={vehicle.body} type="damage" />

      <ItemCardSlot.DamageTrack
        label="Damage"
        max={damageMax}
        current={vehicle.damage?.physical.current ?? 0}
        onChange={handleDamageChange}
      />

      {vehicle.cost !== undefined && (
        <ItemCardSlot.Footer>
          <Nuyen amount={vehicle.cost} />
        </ItemCardSlot.Footer>
      )}
    </BasicItemCard>
  )
}
