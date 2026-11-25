import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { DeviceData } from "#/data/items/deviceData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { GearSubmitMeta } from "#/forms/items/gearSubmitMeta.ts"
import { useItemForm } from "#/forms/items/useItemForm.tsx"

interface DeviceFormOptions {
  device?: DeviceData
  parentId?: UUID
  onSubmit: (device: DeviceData, meta: GearSubmitMeta) => void
}

const defaultFormValues: DeviceData = {
  kind: EntityKind.item,
  id: NullUuid,
  itemType: ItemType.device,
  name: "",
  cost: 0,
  quantity: 1,
  description: "",
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  items: { parentId: null, childIds: [] },
  effects: [],
  state: ItemState.available,
  deviceType: "commlink",
  customDeviceType: "",
  deviceModel: "",
  deviceOS: "",
  deviceRating: 0,
  response: 0,
  signal: 0,
  system: 0,
  firewall: 0,
  dataProcessing: 0,
  programSlots: 0,
}

export const deviceFieldMap = createFieldMap(defaultFormValues)

export const deviceFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useDeviceForm = ({ device, parentId, onSubmit }: DeviceFormOptions) => {
  return useItemForm<DeviceData>({
    item: device,
    defaultValues: parentId
      ? { ...defaultFormValues, items: { ...defaultFormValues.items, parentId } }
      : defaultFormValues,
    onSubmit,
  })
}
