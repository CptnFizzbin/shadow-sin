import { createAction } from "@reduxjs/toolkit"

import type { QualityData } from "#/system/qualityData.ts"

export const addQuality = createAction<QualityData>("qualities/add")
export const updateQuality = createAction<QualityData>("qualities/update")
export const removeQuality = createAction<string>("qualities/remove")
