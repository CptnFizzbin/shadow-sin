export interface StoredJsonFileMetadata {
  path: string
  updatedAt: string
}

export interface StoredJsonFile<TValue> extends StoredJsonFileMetadata {
  value: TValue
}

export interface IStorageProvider {
  readonly providerId: string

  listJsonFiles(pathPrefix?: string): Promise<StoredJsonFileMetadata[]>

  loadJsonFile<TValue>(path: string): Promise<StoredJsonFile<TValue> | null>

  saveJsonFile<TValue>(
    path: string,
    value: TValue,
  ): Promise<StoredJsonFile<TValue>>

  deleteJsonFile(path: string): Promise<void>
}
