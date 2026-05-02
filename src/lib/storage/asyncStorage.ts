export type JsonValue = string | number | boolean | null | JsonObject | JsonArray
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]

export interface AsyncStorage {
  hasKey(key: string): Promise<boolean>
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  // Returns a new AsyncStorage instance that prefixes all keys with the given
  // namespace, creating a view into a sub-tree of the storage.
  namespace(namespace: string): AsyncStorage
}

export interface AsyncJsonStorage extends AsyncStorage {
  getJson<TData extends JsonValue>(key: string): Promise<TData | null>
  setJson<TData extends JsonValue>(key: string, value: TData): Promise<void>
  namespace(namespace: string): AsyncJsonStorage
}

type JsonStorageProvider = {
  getStorage(): AsyncJsonStorage
}

export type { JsonStorageProvider }

class JsonStorageAdapter implements AsyncJsonStorage {
  public constructor(private readonly storage: AsyncStorage) {}

  public hasKey(key: string): Promise<boolean> {
    return this.storage.hasKey(key)
  }

  public getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key)
  }

  public setItem(key: string, value: string): Promise<void> {
    return this.storage.setItem(key, value)
  }

  public removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key)
  }

  public namespace(ns: string): AsyncJsonStorage {
    return toJsonStorage(this.storage.namespace(ns))
  }

  public async getJson<TData extends JsonValue>(key: string): Promise<TData | null> {
    const raw = await this.storage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as TData
  }

  public async setJson<TData extends JsonValue>(key: string, value: TData): Promise<void> {
    await this.storage.setItem(key, JSON.stringify(value))
  }
}

// Wraps any AsyncStorage to add JSON serialization/deserialization.
// namespace() returns a new AsyncJsonStorage wrapping the namespaced view.
export function toJsonStorage(storage: AsyncStorage): AsyncJsonStorage {
  return new JsonStorageAdapter(storage)
}
