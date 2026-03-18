import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"
import { FormPersister } from "#/components/Character/Form/FormPersister.ts"
import { useDefaultValues } from "#/components/Character/Form/UseDefaultValues.ts"
import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"

export const NULL_CHARACTER_ID = "00000000-0000-0000-0000-000000000000"

export const useCharacterForm = (character?: PlayerCharacterData) => {
  return useAppForm({
    defaultValues: useDefaultValues({ character }),
    listeners: {
      onMount: ({ formApi }) => {
        const characterId = formApi.state.values.characterId
        const savedState = FormPersister.loadState(characterId)
        if (!savedState) return

        for (const [key, value] of Object.entries(savedState)) {
          formApi.setFieldValue(key as keyof CharacterFormState, value)
        }
      },

      onChangeDebounceMs: 500,
      onChange: ({ formApi }) => {
        const characterId = formApi.state.values.characterId
        FormPersister.saveState(characterId, formApi.state.values)
      }
    }
  })
}

export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>
