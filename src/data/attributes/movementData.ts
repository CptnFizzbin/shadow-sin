/**
 * Represents a movement mode for a metatype (e.g. ground, fly, swim).
 * `type` is omitted for the default ground movement mode.
 */
export interface MovementData {
  type?: string
  walk: number
  run: number
}
