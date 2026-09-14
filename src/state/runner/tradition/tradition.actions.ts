import { createAction } from "@reduxjs/toolkit"

import type { TraditionData } from "#/system/model/magic/traditionData.ts"

export const saveTradition = createAction<TraditionData>("tradition/save")
