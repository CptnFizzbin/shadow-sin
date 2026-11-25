import { createAction } from "@reduxjs/toolkit"

import type { DamageTrackKey } from "#data/entities/damageTrackKey.ts"

export const setDamage = createAction<{ track: DamageTrackKey, value: number }>("damage/setDamage")
