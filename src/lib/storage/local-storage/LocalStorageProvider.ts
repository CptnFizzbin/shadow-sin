import type {
  IStorageProvider,
  StoredJsonFile,
  StoredJsonFileMetadata,
} from "#/lib/storage/IStorageProvider.ts"

interface LocalStorageProviderOptions {
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

  public constructor({ storagePrefix }: LocalStorageProviderOptions) {
    this.storagePrefix = storagePrefix
  }

  public listJsonFiles(
    pathPrefix?: string,
  ): Promise<StoredJsonFileMetadata[]> {
    const storage = this.getStorage()
    const normalizedPathPrefix = this.normalizePathPrefix(pathPrefix)
    const files: StoredJsonFileMetadata[] = []

    for (let index = 0; index < storage.length; index += 1) {
      const storageKey = storage.key(index)

      if (!storageKey || !storageKey.startsWith(this.getKeyPrefix())) {
        continue
      }

      const rawValue = storage.getItem(storageKey)

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
    const storage = this.getStorage()
    const rawValue = storage.getItem(this.getStorageKey(path))

    if (!rawValue) {
      return Promise.resolve(null)
    }

    return Promise.resolve(this.parseStoredJsonFile<TValue>(rawValue))
  }

  public saveJsonFile<TValue>(
    path: string,
    value: TValue,
  ): Promise<StoredJsonFile<TValue>> {
    const storage = this.getStorage()
    const storedJsonFile: StoredJsonFile<TValue> = {
      path: this.normalizePath(path),
      updatedAt: new Date().toISOString(),
      value,
    }

    storage.setItem(
      this.getStorageKey(path),
      JSON.stringify(storedJsonFile satisfies StoredJsonEnvelope<TValue>),
    )

    return Promise.resolve(storedJsonFile)
  }

  public deleteJsonFile(path: string): Promise<void> {
    const storage = this.getStorage()
    storage.removeItem(this.getStorageKey(path))
    return Promise.resolve()
  }

  private getStorage(): Storage {
    if (!("localStorage" in globalThis)) {
      throw new Error(
        "LocalStorageProvider requires browser localStorage support.",
      )
    }

    return globalThis.localStorage
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
