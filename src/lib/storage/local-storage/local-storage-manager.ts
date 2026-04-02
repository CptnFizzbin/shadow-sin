import { LocalStorageProvider } from "#/lib/storage/local-storage/local-storage-provider.ts"
import { StorageManager } from "#/lib/storage/storage-manager.ts"

export const localStorageManager = new StorageManager(
  new LocalStorageProvider({
    storagePrefix: "shadow-sin",
  }),
)
