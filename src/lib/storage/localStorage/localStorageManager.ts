import { LocalStorageProvider } from "#/lib/storage/localStorage/localStorageProvider.ts"
import { StorageManager } from "#/lib/storage/storageManager.ts"

export const localStorageManager = new StorageManager(
  new LocalStorageProvider({
    storagePrefix: "shadow-sin",
  }),
)
