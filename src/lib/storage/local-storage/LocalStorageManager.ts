import { StorageManager } from "#/lib/storage/StorageManager.ts"
import { LocalStorageProvider } from "#/lib/storage/local-storage/LocalStorageProvider.ts"

export const localStorageManager = new StorageManager(
  new LocalStorageProvider({
    storagePrefix: "shadow-sin",
  }),
)
