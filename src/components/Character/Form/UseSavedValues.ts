import { FormPersister } from "#/components/Character/Form/FormPersister.ts"

export const useSavedValues = (characterId: string) => {
  return FormPersister.loadState(characterId)
}
