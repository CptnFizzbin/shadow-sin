import type { IStorageProvider, StoredJsonFile, StoredJsonFileMetadata } from "#/lib/storage/IStorageProvider.ts"

interface LocalStorageProviderOptions {
  storage?: Storage
  storagePrefix: string
}

interface StoredJsonEnvelope<TValue> {
  path: string
  updatedAt: string
  value: TValue
}

export class LocalStorageProvider implements IStorageProvider {
  public readonly providerId = "local-storage"

  private readonly storagePrefix: string
  private readonly storage: Storage

  public constructor({
    storage = globalThis.localStorage,
    storagePrefix,
  }: LocalStorageProviderOptions) {
    this.storage = storage
    this.storagePrefix = storagePrefix
  }

  public listJsonFiles(
    pathPrefix?: string,
  ): Promise<StoredJsonFileMetadata[]> {
    const normalizedPathPrefix = this.normalizePathPrefix(pathPrefix)
    const files: StoredJsonFileMetadata[] = []

    for (let index = 0; index < this.storage.length; index += 1) {
      const storageKey = this.storage.key(index)

      if (!storageKey || !storageKey.startsWith(this.getKeyPrefix())) {
        continue
      }

      const rawValue = this.storage.getItem(storageKey)

      if (!rawValue) {
        continue
      }

      const storedJsonFile = this.parseStoredJsonFile<unknown>(rawValue)

      if (
        normalizedPathPrefix
        && !storedJsonFile.path.startsWith(normalizedPathPrefix)
      ) {
        continue
      }

      files.push({
        path: storedJsonFile.path,
        updatedAt: storedJsonFile.updatedAt,
      })
    }

    return Promise.resolve(files.sort((firstFile, secondFile) =>
      firstFile.path.localeCompare(secondFile.path),
    ))
  }

  public loadJsonFile<TValue>(
    path: string,
  ): Promise<StoredJsonFile<TValue> | null> {
    const rawValue = this.storage.getItem(this.getStorageKey(path))

    if (!rawValue) {
      return Promise.resolve(null)
    }

    return Promise.resolve(this.parseStoredJsonFile<TValue>(rawValue))
  }

  public saveJsonFile<TValue>(
    path: string,
    value: TValue,
  ): Promise<StoredJsonFile<TValue>> {
    const storedJsonFile: StoredJsonFile<TValue> = {
      path: this.normalizePath(path),
      updatedAt: new Date().toISOString(),
      value,
    }

    this.storage.setItem(
      this.getStorageKey(path),
      JSON.stringify(storedJsonFile satisfies StoredJsonEnvelope<TValue>),
    )

    return Promise.resolve(storedJsonFile)
  }

  public deleteJsonFile(path: string): Promise<void> {
    this.storage.removeItem(this.getStorageKey(path))
    return Promise.resolve()
  }

  private getKeyPrefix(): string {
    return `${this.storagePrefix}:json:`
  }

  private getStorageKey(path: string): string {
    return `${this.getKeyPrefix()}${this.normalizePath(path)}`
  }

  private normalizePath(path: string): string {
    return path.replaceAll("\\", "/").replace(/^\/+/, "")
  }

  private normalizePathPrefix(pathPrefix?: string): string | undefined {
    if (!pathPrefix) {
      return undefined
    }

    return this.normalizePath(pathPrefix)
  }

  private parseStoredJsonFile<TValue>(
    rawValue: string,
  ): StoredJsonFile<TValue> {
    return JSON.parse(rawValue) as StoredJsonFile<TValue>
  }
}
