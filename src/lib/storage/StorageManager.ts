import type { StorageProvider, StoredJsonFile, StoredJsonFileMetadata } from "#/lib/storage/StorageProvider.ts"

export class StorageManager {
  public constructor(private readonly storageProvider: StorageProvider) {}

  public get providerId(): string {
    return this.storageProvider.providerId
  }

  public listJsonFiles(
    pathPrefix?: string,
  ): Promise<StoredJsonFileMetadata[]> {
    return this.storageProvider.listJsonFiles(pathPrefix)
  }

  public loadJsonFile<TValue>(
    path: string,
  ): Promise<StoredJsonFile<TValue> | null> {
    return this.storageProvider.loadJsonFile<TValue>(path)
  }

  public saveJsonFile<TValue>(
    path: string,
    value: TValue,
  ): Promise<StoredJsonFile<TValue>> {
    return this.storageProvider.saveJsonFile(path, value)
  }

  public deleteJsonFile(path: string): Promise<void> {
    return this.storageProvider.deleteJsonFile(path)
  }
}
