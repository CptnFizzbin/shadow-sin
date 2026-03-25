import { debounce } from "@tanstack/pacer"
import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"

import type { BuilderState } from "#/components/CharacterBuilder/BuilderState/BuilderState.ts"
import { FormPersister } from "#/components/CharacterBuilder/FormPersister.ts"
import { useDefaultValues } from "#/components/CharacterBuilder/UseDefaultValues.ts"
import { mergeObjects } from "#/lib/MergeUtils.ts"
import type { CharacterSheet } from "#/lib/system/types/characterSheet.ts"

const debouncedSaveState = debounce(
  (characterId: string, values: BuilderState) => {
    console.log("Saving builder state...", { characterId, values })
    FormPersister.saveState(characterId, values)
  },
  { wait: 500 },
)

export const useRootCharacterBuilderStore = (
  character?: CharacterSheet,
): Store<BuilderState> => {
  const defaultState = useDefaultValues({ character })

  const [builderStore] = useState(() => {
    const savedState = FormPersister.loadState(defaultState.characterId)
    const initialState = savedState
      ? mergeObjects<BuilderState>(defaultState, savedState)
      : defaultState
    return new Store<BuilderState>(initialState)
  })

  useEffect(() => {
    const { unsubscribe } = builderStore.subscribe((state) => {
      debouncedSaveState(state.characterId, state)
    })

    return () => unsubscribe()
  }, [builderStore])

  return builderStore
}
