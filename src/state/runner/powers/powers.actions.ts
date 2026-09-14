import { createAction } from "@reduxjs/toolkit"

import type { AdeptPowerData } from "#/system/model/powers/adeptPowerData.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

export const addPower = createAction<AdeptPowerData>("powers/add")
export const updatePower = createAction<AdeptPowerData>("powers/update")
export const removePower = createAction<string>("powers/remove")

export const savePower = createAction("powers/save", (power: AdeptPowerData) => {
  if (!power.id || power.id === NullUuid) {
    return { payload: { ...power, id: crypto.randomUUID() } }
  }
  return { payload: power }
})
