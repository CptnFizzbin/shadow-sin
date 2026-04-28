import { StorageManager } from "#/lib/storage/storageManager.ts"

import { LocalStorageProvider } from "./localStorageProvider.ts"

export const localStorageManager = new StorageManager(
  new LocalStorageProvider({
    storagePrefix: "shadow-sin",
  }),
)
