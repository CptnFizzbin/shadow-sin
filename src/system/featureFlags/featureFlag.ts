import type { SourceData } from "#/system/sourceData.ts"

/**
 * Describes a single feature flag — a named, typed setting backed by a
 * source book reference and a SR4e stock default value.
 *
 * @template Value - The type of the flag's value. Defaults to `boolean`.
 */
export interface FeatureFlag<Value = boolean> {
  /** Display name shown in the UI. */
  readonly name: string
  /** Human-readable explanation of what this setting does. */
  readonly description?: string
  /** The rulebook and page where this option is defined. */
  readonly source: SourceData
  /** The SR4e stock default for this flag. */
  readonly defaultValue: Value
}

export type AnyFeatureFlag = FeatureFlag<any>

/**
 * Factory for defining a {@link FeatureFlag} entry in a registry.
 * Infers the flag's value type from `config.defaultValue`.
 *
 * @example
 * const encumbranceEnabled = createFlag<boolean>({
 *   name: "Encumbrance",
 *   source: { book: "SR4A", page: 160 },
 *   defaultValue: false,
 * })
 */
export function createFlag<Value = boolean>(config: FeatureFlag<Value>): FeatureFlag<Value> {
  return config
}

/**
 * Extracts the value type `V` from a {@link FeatureFlag}<V>.
 *
 * @example
 * type Entry = FeatureFlag<boolean>
 * type Val = FeatureFlagValue<Entry> // boolean
 */
export type FeatureFlagValue<F extends FeatureFlag<unknown>> =
  F extends FeatureFlag<infer V>
    ? V
    : never
