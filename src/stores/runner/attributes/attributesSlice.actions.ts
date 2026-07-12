import { createAction } from "@reduxjs/toolkit"

import type { AttributeKey } from "#/system/attributeKey.ts"

export const setAttribute = createAction<{ key: AttributeKey, value: number }>("attributes/set")

/** Relative adjustment, optionally clamped to a minimum (e.g. burning Edge never drops below 1). */
export const adjustAttribute = createAction<{ key: AttributeKey, delta: number, min?: number }>("attributes/adjust")
