import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import { createAttrFormState } from "#/components/CharacterBuilder/Sections/Attributes/AttrFormState.ts"
import type { MetatypeType } from "#/lib/system/MetatypeData.ts"
import { metatypes } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/awakeningType.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

export const useBuilderBiologyApi = () => {
  const store = useCharacterSheetContext()
  const metatypeKey = useStore(store, (state) => state.biology.metatype)
  const awakeningType = useStore(store, (state) => state.biology.awakening)

  const resetAttributes = (
    newMetatypeKey: MetatypeType,
    newAwakeningType: AwakeningType,
  ) => {
    const metatype = metatypes[newMetatypeKey]
    const awakening = awakenings[newAwakeningType]
    const attrsToUpdate = Object.values(AttributeKey).filter(
      (attr) => attr !== AttributeKey.essence,
    )

    store.setState(produce((draft) => {
      for (const attr of attrsToUpdate) {
        draft.attributes[attr] = createAttrFormState({ attr, metatype, awakening }).min
      }
    }))
  }

  return {
    metatypeKey,
    awakeningType,

    setMetatype(newMetatypeKey: MetatypeType) {
      store.setState(produce((draft) => {
        draft.biology.metatype = newMetatypeKey
      }))
      resetAttributes(newMetatypeKey, awakeningType)
    },

    setAwakening(newAwakeningType: AwakeningType) {
      store.setState(produce((draft) => {
        draft.biology.awakening = newAwakeningType
      }))
      resetAttributes(metatypeKey, newAwakeningType)
    },
  }
}
