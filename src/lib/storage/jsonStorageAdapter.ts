import type { JsonValue } from "#/lib/jsonUtils.ts"

import type { AsyncJsonStorage, AsyncStorage } from "./asyncStorage.ts"

export class JsonStorageAdapter implements AsyncJsonStorage {
  public constructor(private readonly storage: AsyncStorage) {}

  // required by the AsyncJsonStorage interface
  public hasKey(key: string): Promise<boolean> {
    return this.storage.hasKey(key)
  }

  public async getItem<TData extends JsonValue = JsonValue>(key: string): Promise<TData | null> {
    const raw = await this.storage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as TData
  }

  public async setItem<TData extends JsonValue = JsonValue>(key: string, value: TData): Promise<void> {
    await this.storage.setItem(key, JSON.stringify(value))
  }

  // required by the AsyncJsonStorage interface
  public removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key)
  }

  // required by the AsyncJsonStorage interface
  public namespace(ns: string): AsyncJsonStorage {
    return new JsonStorageAdapter(this.storage.namespace(ns))
  }
}
