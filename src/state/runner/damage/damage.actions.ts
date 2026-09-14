import { createAction } from "@reduxjs/toolkit"

import type { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"

export const setDamage = createAction<{ track: DamageTrackKey, value: number }>("damage/setDamage")
