import { debounce } from "@tanstack/pacer"
import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"

import type { CharacterFormState } from "#/components/CharacterBuilder/CharacterFormState.ts"
import { FormPersister } from "#/components/CharacterBuilder/FormPersister.ts"
import { useDefaultValues } from "#/components/CharacterBuilder/UseDefaultValues.ts"
import { mergeObjects } from "#/lib/MergeUtils.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

const debouncedSaveState = debounce(
  (characterId: string, values: CharacterFormState) => {
    console.log("Saving form state...", { characterId, values })
    FormPersister.saveState(characterId, values)
  },
  { wait: 500 },
)

export const useRootCharacterBuilderStore = (
  character?: PlayerCharacterData,
): Store<CharacterFormState> => {
  const defaultValues = useDefaultValues({ character })

  const [store] = useState(() => {
    const savedState = FormPersister.loadState(defaultValues.characterId)
    const initialState = savedState
      ? mergeObjects<CharacterFormState>(defaultValues, savedState)
      : defaultValues
    return new Store<CharacterFormState>(initialState)
  })

  useEffect(() => {
    const { unsubscribe } = store.subscribe((state) => {
      debouncedSaveState(state.characterId, state)
    })

    return () => unsubscribe()
  }, [store])

  return store
}
