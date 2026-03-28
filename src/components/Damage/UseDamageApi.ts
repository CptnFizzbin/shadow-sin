import { produce } from "immer"

import { useCharacterSheet, useCharacterSheetStore } from "#/components/Character/CharacterStoreProvider.tsx"
import { useAttrApi } from "#/components/CharacterBuilder/Sections/Attributes/UseAttrApi.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export const useDamageApi = () => {
  const sheetStore = useCharacterSheet()
  const damageMonitors = useCharacterSheetStore((sheet) => sheet.damage)
  const bodyAttr = useAttrApi(AttributeKey.body, sheetStore)
  const willpowerAttr = useAttrApi(AttributeKey.willpower, sheetStore)

  return {
    physical: {
      max: 8 + (Math.ceil(bodyAttr.value / 2)),
      current: damageMonitors.physical,
      setValue: (newValue: number) => {
        sheetStore.setState(produce((sheet) => {
          sheet.damage.physical = newValue
        }))
      },
    },

    stun: {
      max: 8 + (Math.ceil(willpowerAttr.value / 2)),
      current: damageMonitors.stun,
      setValue: (newValue: number) => {
        sheetStore.setState(produce((sheet) => {
          sheet.damage.stun = newValue
        }))
      },
    },

    matrix: {
      // TODO: add in a Matrix update
      max: 0, // 8 + (Math.ceil(systemAttr.value / 2))
      current: damageMonitors.matrix,
      setValue: (newValue: number) => {
        sheetStore.setState(produce((sheet) => {
          sheet.damage.matrix = newValue
        }))
      },
    },

    woundMod: [
      Math.floor(damageMonitors.physical / 3),
      Math.floor(damageMonitors.stun / 3),
    ].reduce((a, b) => a + b, 0),
  }
}
