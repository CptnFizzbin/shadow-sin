export type JsonValue = string | number | boolean | null | JsonObject | JsonArray
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]

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

export function toJsonValue(value: unknown): JsonValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- single escape hatch; callers stay assertion-free
  return value as any
}
