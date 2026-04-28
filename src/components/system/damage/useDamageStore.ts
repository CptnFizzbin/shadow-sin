import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

import { DamageStore } from "./damageStore.ts"
import { selectWoundInterval } from "./damageUtils.ts"

export const useDamageStore = (): DamageStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    return new DamageStore(
      createSliceAtom(
        sheetStore,
        (sheet) => ({
          physical: {
            max: 8 + Math.ceil(sheet.attributes[AttributeKey.body] / 2),
            current: sheet.damage.physical,
            woundInterval: selectWoundInterval(DamageTrackKey.physical)(sheet),
          },
          stun: {
            max: 8 + Math.ceil(sheet.attributes[AttributeKey.willpower] / 2),
            current: sheet.damage.stun,
            woundInterval: selectWoundInterval(DamageTrackKey.stun)(sheet),
          },
          matrix: {
            // TODO: add in a Matrix update
            max: 0, // 8 + Math.ceil(systemAttr / 2)
            current: sheet.damage.matrix,
            woundInterval: 3,
          },
        }),
        (sheet, state) =>
          produce(sheet, (draft) => {
            draft.damage.physical = state.physical.current
            draft.damage.stun = state.stun.current
            draft.damage.matrix = state.matrix.current
          }),
      ),
    )
  }, [sheetStore])
}
