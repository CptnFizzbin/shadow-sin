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

// Type-safe escape hatch for serializing structured objects at storage
// boundaries. Centralises the unsafe cast into a single named helper so call
// sites can stay free of `as unknown as JsonValue` double assertions.
export function toJsonValue(value: unknown): JsonValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- single escape hatch; callers stay assertion-free
  return value as any
}

// Reverse of toJsonValue — casts a JsonValue back to a caller-specified type.
// Use at deserialization boundaries where the stored type is known.
export function fromJsonValue<T>(value: JsonValue): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- single escape hatch; callers stay assertion-free
  return value as any
}
