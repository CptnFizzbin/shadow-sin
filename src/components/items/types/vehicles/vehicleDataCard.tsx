import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"

interface VehicleDataCardProps {
  vehicle: VehicleData
  onOpen?: () => void
  onEdit?: () => void
}

export const VehicleDataCard: FC<VehicleDataCardProps> = ({ vehicle, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const attachments = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(vehicle.id))
  const hasAttachments = Object.keys(attachments).length > 0
  const removeVehicle = () => dispatch(Actions.item.removeItem({ id: vehicle.id, removeChildren: true }))
  // Same 8 + Ceil(Body / 2) formula as a character's own physical track (damageSlice.selectors.ts)
  // and Spirit's condition monitor (calculateSpiritConditionMonitor).
  const damageMax = 8 + Math.ceil(vehicle.body / 2)

  const handleDamageChange = (physical: number) => {
    const updated: VehicleData = { ...vehicle, damage: { physical } }
    dispatch(Actions.item.setItem(updated))
  }

  return (
    <ItemCard item={vehicle} onOpen={onOpen} onEdit={onEdit} onRemove={removeVehicle}>
      <ItemCard.SubType label={vehicle.vehicleType} />

      <ItemCard.Stat label="Handling" value={vehicle.handling} type="rating" />
      <ItemCard.Stat label="Accel" value={vehicle.accel} type="rating" />
      <ItemCard.Stat label="Speed" value={vehicle.speed} type="rating" />
      <ItemCard.Stat label="Armor" value={vehicle.armor} type="damage" />
      <ItemCard.Stat label="Body" value={vehicle.body} type="damage" />

      <ItemCard.Layout.BodyRow>
        <ItemCard.DamageTrack
          label="Damage"
          max={damageMax}
          current={vehicle.damage?.physical ?? 0}
          onChange={handleDamageChange}
        />
      </ItemCard.Layout.BodyRow>

      {hasAttachments && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          {Object.values(attachments).map((attachment) => (
            <ItemCard.Subitem key={attachment.id} name={attachment.name} />
          ))}
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
