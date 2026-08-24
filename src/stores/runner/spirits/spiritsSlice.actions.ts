import { createAction } from "@reduxjs/toolkit"

import type { SpiritData } from "#/system/magic/spiritData.ts"

export const saveSpirit = createAction<SpiritData>("spirits/save")
export const removeSpirit = createAction<string>("spirits/remove")
