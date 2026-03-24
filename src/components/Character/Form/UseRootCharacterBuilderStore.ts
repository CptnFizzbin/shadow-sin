import { debounce } from "@tanstack/pacer"
import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"

import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import { FormPersister } from "#/components/Character/Form/FormPersister.ts"
import { useDefaultValues } from "#/components/Character/Form/UseDefaultValues.ts"
import type { BuilderState } from "#/components/CharacterBuilder/BuilderState.ts"
import { mergeObjects } from "#/lib/MergeUtils.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

const debouncedSaveState = debounce(
  (characterId: string, values: CharacterFormState) => {
    console.log("Saving form state...", { characterId, values })
    FormPersister.saveState(characterId, values)
  },
  { wait: 500 },
)

export interface RootCharacterBuilderStores {
  characterStore: Store<CharacterFormState>
  builderStore: Store<BuilderState>
}

export const useRootCharacterBuilderStore = (
  character?: PlayerCharacterData,
): RootCharacterBuilderStores => {
  const {
    characterFormState: defaultCharacterState,
    builderState: defaultBuilderState,
  } = useDefaultValues({ character })

  const [characterStore] = useState(() => {
    const savedState = FormPersister.loadState(
      defaultCharacterState.characterId,
    )
    const initialState = savedState
      ? mergeObjects<CharacterFormState>(defaultCharacterState, savedState)
      : defaultCharacterState
    return new Store<CharacterFormState>(initialState)
  })

  const [builderStore] = useState(
    () => new Store<BuilderState>(defaultBuilderState),
  )

  useEffect(() => {
    const { unsubscribe } = characterStore.subscribe((state) => {
      debouncedSaveState(state.characterId, state)
    })

    return () => unsubscribe()
  }, [characterStore])

  return { characterStore, builderStore }
}
