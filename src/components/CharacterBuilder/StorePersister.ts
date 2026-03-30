import { debounce } from "@tanstack/pacer"
import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"

import { mergeObjects } from "#/lib/MergeUtils.ts"

const FORM_STORAGE_KEY_PREFIX = "shadow-sin:character-form:"

function getFormStorageKey(characterId: string): string {
  return `${FORM_STORAGE_KEY_PREFIX}${characterId}`
}

function loadState<TData extends object>(persistanceKey: string): TData | undefined {
  const rawValue =
    globalThis.localStorage?.getItem(getFormStorageKey(persistanceKey))
    ?? undefined
  if (!rawValue) return undefined

  try {
    return JSON.parse(rawValue)
  } catch {
    return undefined
  }
}

function saveState<TData extends object>(persistanceKey: string, state: TData): void {
  try {
    globalThis.localStorage?.setItem(
      getFormStorageKey(persistanceKey),
      JSON.stringify(state),
    )
  } catch {
    /* storage unavailable */
  }
}

function clearState(persistanceKey: string): void {
  try {
    globalThis.localStorage?.removeItem(getFormStorageKey(persistanceKey))
  } catch {
    /* storage unavailable */
  }
}

export const StorePersister = {
  loadState,
  saveState,
  clearState,
}

const debouncedSaveState = debounce(
  (characterId: string, values: object) => {
    console.log("Saving form state...", { characterId, values })
    StorePersister.saveState(characterId, values)
  },
  { wait: 500 },
)

export function usePersistedStore<TData extends object>(persistanceKey: string, defaultData: TData): Store<TData> {
  const [store] = useState(() => {
    const savedState = StorePersister.loadState(persistanceKey)

    const initialState = savedState
      ? mergeObjects<TData>(defaultData, savedState)
      : defaultData

    return new Store<TData>(initialState)
  })

  useEffect(() => {
    const { unsubscribe } = store.subscribe((state) => {
      debouncedSaveState(persistanceKey, state)
    })

    return () => unsubscribe()
  }, [persistanceKey, store])

  return store
}
