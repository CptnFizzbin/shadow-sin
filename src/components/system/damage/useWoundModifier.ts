import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

import { selectTrackWoundModifier } from "./damageUtils.ts"

export function useWoundModifier() {
  return useCharacterSheet((sheet) =>
    selectTrackWoundModifier(DamageTrackKey.physical)(sheet)
    + selectTrackWoundModifier(DamageTrackKey.stun)(sheet),
  )
}
