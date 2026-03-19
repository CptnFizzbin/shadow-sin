import type { CharacterFormState } from "./CharacterFormState.ts"

const FORM_STORAGE_KEY_PREFIX = "shadow-sin:character-form:"

function getFormStorageKey(characterId: string): string {
  return `${FORM_STORAGE_KEY_PREFIX}${characterId}`
}

function loadState(characterId: string): CharacterFormState | undefined {
  const rawValue =
    globalThis.localStorage?.getItem(getFormStorageKey(characterId)) ??
    undefined
  if (!rawValue) return undefined

  try {
    return JSON.parse(rawValue) as CharacterFormState
  } catch {
    return undefined
  }
}

function saveState(characterId: string, state: CharacterFormState): void {
  try {
    globalThis.localStorage?.setItem(
      getFormStorageKey(characterId),
      JSON.stringify(state),
    )
  } catch {
    /* storage unavailable */
  }
}

function clearState(characterId: string): void {
  try {
    globalThis.localStorage?.removeItem(getFormStorageKey(characterId))
  } catch {
    /* storage unavailable */
  }
}

export const FormPersister = {
  loadState,
  saveState,
  clearState,
}
