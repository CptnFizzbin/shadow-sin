import { useStore } from "@tanstack/react-store"
import type { Store } from "@tanstack/store"
import { produce } from "immer"

import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

export function useAttrApi<TAttrKey extends AttributeKey>(
  attr: TAttrKey,
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

  return {
    value: value,
    min: metatype.attributes[attr].min,
    max: metatype.attributes[attr].max,
    augMax: metatype.attributes[attr].augMax,

    setValue(newValue: number) {
      return store.setState(produce((sheet) => {
        if (typeof store.state.attributes[attr] === "number") {
          sheet.attributes[attr] = newValue
        } else {
          store.state.attributes[attr].value = newValue
        }
      }))
    },
  }
}
