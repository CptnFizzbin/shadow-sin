import { createAction } from "@reduxjs/toolkit"

import type { TraditionData } from "#/data/magic/traditionData.ts"

export const saveTradition = createAction<TraditionData>("tradition/save")
