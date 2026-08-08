import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"

interface VehicleDataCardProps {
  vehicle: VehicleData
  onOpen?: () => void
  onEdit?: () => void
}

export const VehicleDataCard: FC<VehicleDataCardProps> = ({ vehicle, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const attachments = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(vehicle.id))
  const removeVehicle = () => dispatch(Actions.gear.removeItem({ id: vehicle.id, removeChildren: true }))
  // Same 8 + Ceil(Body / 2) formula as a character's own physical track (damageSlice.selectors.ts)
  // and Spirit's condition monitor (calculateSpiritConditionMonitor).
  const damageMax = 8 + Math.ceil(vehicle.body / 2)

  const handleDamageChange = (physical: number) => {
    const updated: VehicleData = { ...vehicle, damage: { physical } }
    dispatch(Actions.gear.setItem(updated))
  }

  return (
    <ItemDataCardRoot item={vehicle} subType={vehicle.vehicleType} onOpen={onOpen} onEdit={onEdit} onRemove={removeVehicle}>
      <DataCard.Stat label="Handling" value={vehicle.handling} type="rating" />
      <DataCard.Stat label="Accel" value={vehicle.accel} type="rating" />
      <DataCard.Stat label="Speed" value={vehicle.speed} type="rating" />
      <DataCard.Stat label="Armor" value={vehicle.armor} type="damage" />
      <DataCard.Stat label="Body" value={vehicle.body} type="damage" />

      <DataCard.DamageTrack
        label="Damage"
        max={damageMax}
        current={vehicle.damage?.physical ?? 0}
        onChange={handleDamageChange}
      />

      {Object.values(attachments).map((attachment) => (
        <DataCard.Subitem key={attachment.id} name={attachment.name} />
      ))}
    </ItemDataCardRoot>
  )
}
