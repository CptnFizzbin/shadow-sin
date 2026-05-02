import type { AsyncJsonStorage, JsonStorageProvider } from "#/lib/storage/asyncStorage.ts"

class NotImplementedError extends Error {
  public constructor(message: string) {
    super(message)
    this.name = "NotImplementedError"
  }
}

// Placeholder stub for future Google Drive integration.
// Internally will use CachedStorage with ttl: 10 minutes, debounce: 30 seconds.
// Returns a singleton — getStorage() always returns the same instance.
export const GoogleDriveStorageProvider: JsonStorageProvider = {
  getStorage(): AsyncJsonStorage {
    throw new NotImplementedError("Google Drive storage is not yet implemented.")
  },
}
