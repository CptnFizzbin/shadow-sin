import { NotImplementedError } from "#/lib/errors/notImplementedError.ts"
import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"

export const GoogleDriveStorageProvider = {
  getStorage(): AsyncJsonStorage {
    throw new NotImplementedError("Google Drive storage is not yet implemented.")
  },
}
