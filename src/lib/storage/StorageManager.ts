import type {
  IStorageProvider,
  StoredJsonFile,
  StoredJsonFileMetadata,
} from "#/lib/storage/IStorageProvider.ts"

export class StorageManager {
  public constructor(private readonly storageProvider: IStorageProvider) {}

  public get providerId(): string {
    return this.storageProvider.providerId
  }

  public async listJsonFiles(
    pathPrefix?: string,
  ): Promise<StoredJsonFileMetadata[]> {
    return this.storageProvider.listJsonFiles(pathPrefix)
  }

  public async loadJsonFile<TValue>(
    path: string,
  ): Promise<StoredJsonFile<TValue> | null> {
    return this.storageProvider.loadJsonFile<TValue>(path)
  }

  public async saveJsonFile<TValue>(
    path: string,
    value: TValue,
  ): Promise<StoredJsonFile<TValue>> {
    return this.storageProvider.saveJsonFile(path, value)
  }

  public async deleteJsonFile(path: string): Promise<void> {
    return this.storageProvider.deleteJsonFile(path)
  }
}
