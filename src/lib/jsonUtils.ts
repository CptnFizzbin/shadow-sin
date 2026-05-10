export type JsonValue = string | number | boolean | null | JsonObject | JsonArray
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]

export function toJsonValue(value: unknown): JsonValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- single escape hatch; callers stay assertion-free
  return value as any
}
