import type { JsonValue } from "#/lib/jsonUtils.ts"

export interface AsyncStorage {
  hasKey(key: string): Promise<boolean>

  getItem(key: string): Promise<string | null>

  setItem(key: string, value: string): Promise<void>

  removeItem(key: string): Promise<void>

  namespace(namespace: string): AsyncStorage
}

export interface AsyncJsonStorage {
  hasKey(key: string): Promise<boolean>

  getItem<TData extends JsonValue = JsonValue>(key: string): Promise<TData | null>

  setItem<TData extends JsonValue = JsonValue>(key: string, value: TData): Promise<void>

  removeItem(key: string): Promise<void>

  namespace(namespace: string): AsyncJsonStorage
}
