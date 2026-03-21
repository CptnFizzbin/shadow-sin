import { debounce } from "@tanstack/pacer"
import { useEffect } from "react"

import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import { FormPersister } from "#/components/Character/Form/FormPersister.ts"
import { useDefaultValues } from "#/components/Character/Form/UseDefaultValues.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { mergeObjects } from "#/lib/MergeUtils.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

const debouncedSaveState = debounce(
  (characterId: string, values: CharacterFormState) => {
    console.log("Saving form state...", { characterId, values })
    FormPersister.saveState(characterId, values)
  },
  { wait: 500 },
)

export const useCharacterForm = (character?: PlayerCharacterData) => {
  const form = useAppForm({
    defaultValues: useDefaultValues({ character }),
    listeners: {
      onMount: ({ formApi }) => {
        const characterId = formApi.state.values.characterId
        const savedState = FormPersister.loadState(characterId)
        if (!savedState) return

        const merged = mergeObjects<CharacterFormState>(
          formApi.state.values,
          savedState,
        )

        for (const [key, value] of Object.entries(merged)) {
          formApi.setFieldValue(key as keyof CharacterFormState, value)
        }
      },
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.store.subscribe(({ values }) => {
      debouncedSaveState(values.characterId, values)
    })

    return () => unsubscribe()
  }, [form])

  return form
}

export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>
