import type { AsyncJsonStorage, AsyncStorage, JsonValue } from "./asyncStorage.ts"

export class JsonStorageAdapter implements AsyncJsonStorage {
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
    return new JsonStorageAdapter(this.storage.namespace(ns))
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
