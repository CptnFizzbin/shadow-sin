import { createAction } from "@reduxjs/toolkit"

import type { TraditionData } from "#/system/magic/traditionData.ts"

export const saveTradition = createAction<TraditionData>("tradition/save")
