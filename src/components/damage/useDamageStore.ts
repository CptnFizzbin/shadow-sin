import { produce } from "immer"

import { useCharacterSheet, useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { getWoundInterval } from "#/components/damage/damageUtils.ts"
import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { DamageTrackKey } from "#/lib/system/damageTrackKey.ts"

export const useDamageStore = () => {
  const sheetStore = useCharacterSheetContext()
  const damageMonitors = useCharacterSheet((sheet) => sheet.damage)
  const bodyAttr = useAttr(AttributeKey.body)
  const willpowerAttr = useAttr(AttributeKey.willpower)
  const physicalWoundInterval = useCharacterSheet((sheet) => getWoundInterval(sheet, DamageTrackKey.physical))
  const stunWoundInterval = useCharacterSheet((sheet) => getWoundInterval(sheet, DamageTrackKey.stun))

  return {
    physical: {
      max: 8 + (Math.ceil(bodyAttr / 2)),
      current: damageMonitors.physical,
      woundInterval: physicalWoundInterval,
      setValue: (valueOrUpdater: number | Recipe<number>) => {
        sheetStore.setState(produce((sheet) => {
          sheet.damage.physical = typeof valueOrUpdater === "function"
            ? valueOrUpdater(sheet.damage.physical)
            : valueOrUpdater
        }))
      },
    },

    stun: {
      max: 8 + (Math.ceil(willpowerAttr / 2)),
      current: damageMonitors.stun,
      woundInterval: stunWoundInterval,
      setValue: (valueOrUpdater: number | Recipe<number>) => {
        sheetStore.setState(produce((sheet) => {
          sheet.damage.stun = typeof valueOrUpdater === "function"
            ? valueOrUpdater(sheet.damage.stun)
            : valueOrUpdater
        }))
      },
    },

    matrix: {
      // TODO: add in a Matrix update
      max: 0, // 8 + (Math.ceil(systemAttr.value / 2))
      current: damageMonitors.matrix,
      woundInterval: 3,
      setValue: (valueOrUpdater: number | Recipe<number>) => {
        sheetStore.setState(produce((sheet) => {
          sheet.damage.matrix = typeof valueOrUpdater === "function"
            ? valueOrUpdater(sheet.damage.matrix)
            : valueOrUpdater
        }))
      },
    },
  }
}
