import { debounce } from "@tanstack/pacer"
import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"

import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import { FormPersister } from "#/components/Character/Form/FormPersister.ts"
import { useDefaultValues } from "#/components/Character/Form/UseDefaultValues.ts"
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
    return new Store<CharacterFormState>(savedState ?? defaultValues)
  })

  useEffect(() => {
    const { unsubscribe } = store.subscribe((state) => {
      debouncedSaveState(state.characterId, state)
    })

    return () => unsubscribe()
  }, [store])

  return store
}
