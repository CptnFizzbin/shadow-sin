import type { AnyFunction } from "@tanstack/pacer"
import { debounce } from "@tanstack/pacer"

import type { StorageProvider, StoredJsonFile, StoredJsonFileMetadata } from "#/lib/storage/storageProvider.ts"

export class StorageManager {
  private readonly debouncedSaveFns: Record<string, AnyFunction> = {}

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
    const saveFn = this.debouncedSaveFns[path] ??= debounce((content: TValue) => {
      return this.storageProvider.saveJsonFile(path, content)
    }, { wait: 1000 })

    return saveFn(value)
  }

  public deleteJsonFile(path: string): Promise<void> {
    return this.storageProvider.deleteJsonFile(path)
  }
}
