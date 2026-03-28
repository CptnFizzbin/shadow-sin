import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { createAttrFormState } from "#/components/CharacterBuilder/Sections/Attributes/AttrFormState.ts"
import type { MetatypeKey } from "#/lib/system/MetatypeData.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/awakeningType.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

export const useBuilderBiologyApi = () => {
  const store = useCharacterBuilderStoreContext()
  const metatypeKey = useStore(store, (state) => state.metatype)
  const awakeningType = useStore(store, (state) => state.awakening)

  const resetAttributes = (
    newMetatypeKey: MetatypeKey,
    newAwakeningType: AwakeningType,
  ) => {
    const metatype = metatypes[newMetatypeKey]
    const awakening = awakenings[newAwakeningType]
    const attrsToUpdate = Object.values(AttributeKey).filter(
      (attr) => attr !== AttributeKey.essence,
    )

    store.setState(produce((draft) => {
      for (const attr of attrsToUpdate) {
        draft.attributes[attr] = createAttrFormState({
          value: metatype.attributes[attr].min,
          attr,
          metatype,
          awakening,
        })
      }
    }))
  }

  return {
    metatypeKey,
    awakeningType,

    setMetatype(newMetatypeKey: MetatypeKey) {
      store.setState(produce((draft) => {
        draft.metatype = newMetatypeKey
      }))
      resetAttributes(newMetatypeKey, awakeningType)
    },

    setAwakening(newAwakeningType: AwakeningType) {
      store.setState(produce((draft) => {
        draft.awakening = newAwakeningType
      }))
      resetAttributes(metatypeKey, newAwakeningType)
    },
  }
}
