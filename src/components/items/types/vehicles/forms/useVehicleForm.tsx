import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useItemForm } from "#/components/items/forms/useItemForm.tsx"
import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import { ItemType } from "#/system/itemType.ts"

interface VehicleFormOptions {
  vehicle?: VehicleData
  vehicleCategory?: VehicleCategory
  onSubmit: (vehicle: VehicleData, meta: GearSubmitMeta) => void
}

const defaultFormValues = {
  id: NullUuid,
  itemType: ItemType.vehicle as typeof ItemType.vehicle,
  vehicleCategory: VehicleCategory.vehicle,
  vehicleType: "",
  model: "",
  name: "",
  cost: 0,
  description: "",
  quantity: 1,
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  effects: [] as VehicleData["effects"],

  handling: 0,
  accel: "0/0" as string,
  pilot: 0,
  speed: 0,
  body: 0,
  armor: 0,
  sensor: 0,
  seats: undefined as number | undefined,
  rating: undefined as number | undefined,
  damage: {
    physical: {
      current: 0,
      max: 0,
    },
  },
}

type VehicleFormState = typeof defaultFormValues

export const vehicleFieldMap = createFieldMap(defaultFormValues)

export const vehicleFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

function toVehicleData(values: VehicleFormState): VehicleData {
  return {
    id: values.id,
    itemType: ItemType.vehicle,
    vehicleCategory: values.vehicleCategory,
    vehicleType: values.vehicleType,
    ...(values.model && { model: values.model }),
    name: values.name,
    cost: values.cost,
    description: values.description,
    quantity: values.quantity,
    availability: values.availability,
    source: values.source,
    effects: values.effects,
    handling: values.handling,
    accel: values.accel as VehicleData["accel"],
    pilot: values.pilot,
    speed: values.speed,
    body: values.body,
    armor: values.armor,
    sensor: values.sensor,
    ...(values.seats !== undefined && { seats: values.seats }),
    ...(values.rating !== undefined && { rating: values.rating }),
    damage: {
      physical: {
        current: values.damage.physical.current,
        max: values.damage.physical.max,
      },
    },
  }
}

function vehicleToFormState(vehicle: VehicleData): VehicleFormState {
  return {
    ...defaultFormValues,
    id: vehicle.id,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleType: vehicle.vehicleType ?? "",
    model: vehicle.model ?? "",
    name: vehicle.name,
    cost: vehicle.cost ?? 0,
    description: vehicle.description ?? "",
    quantity: vehicle.quantity ?? 1,
    availability: {
      rating: vehicle.availability?.rating ?? 0,
      restricted: vehicle.availability?.restricted ?? false,
      forbidden: vehicle.availability?.forbidden ?? false,
    },
    source: {
      book: vehicle.source?.book ?? "",
      page: vehicle.source?.page ?? 0,
    },
    effects: vehicle.effects ?? [],
    handling: vehicle.handling,
    accel: vehicle.accel,
    pilot: vehicle.pilot,
    speed: vehicle.speed,
    body: vehicle.body,
    armor: vehicle.armor,
    sensor: vehicle.sensor,
    seats: vehicle.seats,
    rating: typeof vehicle.rating === "number" ? vehicle.rating : undefined,
    damage: {
      physical: {
        current: vehicle.damage?.physical.current ?? 0,
        max: vehicle.damage?.physical.max ?? 0,
      },
    },
  }
}

export const useVehicleForm = ({ vehicle, vehicleCategory, onSubmit }: VehicleFormOptions) => {
  return useItemForm<VehicleFormState>({
    item: vehicle ? vehicleToFormState(vehicle) : undefined,
    defaultValues: { ...defaultFormValues, vehicleCategory: vehicleCategory ?? VehicleCategory.vehicle },
    onSubmit: (formState, meta) => onSubmit(toVehicleData(formState), meta),
  })
}
