import { NotImplementedError } from "#/lib/errors/notImplementedError.ts"
import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"

// Placeholder stub for future Google Drive integration.
// Internally will use CachedStorage with ttl: 10 minutes, debounce: 30 seconds.
// Returns a singleton — getStorage() always returns the same instance.
export const GoogleDriveStorageProvider = {
  getStorage(): AsyncJsonStorage {
    throw new NotImplementedError("Google Drive storage is not yet implemented.")
  },
}
