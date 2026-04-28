import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

import { selectWoundInterval } from "./damageUtils.ts"

export function useWoundModifier() {
  return useCharacterSheet((sheet) => {
    const physicalInterval = selectWoundInterval(DamageTrackKey.physical)(sheet)
    const stunInterval = selectWoundInterval(DamageTrackKey.stun)(sheet)
    return (
      Math.floor(sheet.damage.physical / physicalInterval)
      + Math.floor(sheet.damage.stun / stunInterval)
    )
  })
}
