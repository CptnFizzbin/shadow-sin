import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import { produce } from "immer"

import { getAttrData } from "#/components/Attributes/AttrData.ts"
import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

export function useAttrApi(
  attr: AttributeKey,
  store: Store<PlayerCharacterData | CharacterBuilderState>,
) {
  const value = useStore(store, () => {
    const attribute = store.state.attributes[attr]
    return typeof attribute === "number" ? attribute : attribute.value
  })

  const metatype = useStore(store, (state) => {
    const metatypeKey =
      "biology" in state
        ? state.biology.metatype
        : state.metatype

    return metatypes[metatypeKey]
  })

  const awakening = useStore(store, (state) => {
    const awakeningType =
      "biology" in state
        ? state.biology.awakening
        : state.awakening

    return awakenings[awakeningType]
  })

  return {
    label: AttributeLabels[attr],
    ...getAttrData(attr, value, metatype, awakening),

    setValue(newValue: number) {
      store.setState(produce((sheet) => {
        if (typeof sheet.attributes[attr] === "number") {
          sheet.attributes[attr] = newValue
        } else {
          sheet.attributes[attr].value = newValue
        }
      }))
    },
  }
}
