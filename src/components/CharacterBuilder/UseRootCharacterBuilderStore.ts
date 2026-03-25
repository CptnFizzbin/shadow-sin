import { debounce } from "@tanstack/pacer"
import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"

import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import { FormPersister } from "#/components/CharacterBuilder/FormPersister.ts"
import { useDefaultValues } from "#/components/CharacterBuilder/UseDefaultValues.ts"
import { mergeObjects } from "#/lib/MergeUtils.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

const debouncedSaveState = debounce(
  (characterId: string, values: CharacterBuilderState) => {
    console.log("Saving form state...", { characterId, values })
    FormPersister.saveState(characterId, values)
  },
  { wait: 500 },
)

export const useRootCharacterBuilderStore = (
  character?: PlayerCharacterData,
): Store<CharacterBuilderState> => {
  const defaultValues = useDefaultValues({ character })

  const [store] = useState(() => {
    const savedState = FormPersister.loadState(defaultValues.characterId)
    const initialState = savedState
      ? mergeObjects<CharacterBuilderState>(defaultValues, savedState)
      : defaultValues
    return new Store<CharacterBuilderState>(initialState)
  })

  useEffect(() => {
    const { unsubscribe } = store.subscribe((state) => {
      debouncedSaveState(state.characterId, state)
    })

    return () => unsubscribe()
  }, [store])

  return store
}
